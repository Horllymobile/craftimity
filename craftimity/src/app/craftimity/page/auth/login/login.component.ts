import { Component, OnInit } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController, NavController, isPlatform } from '@ionic/angular';
import { Observable, finalize, map } from 'rxjs';
import { STORAGE_VARIABLES } from 'src/app/core/constants/storage';
import { ISignIn } from 'src/app/core/models/auth';
import { ICountry } from 'src/app/core/models/location';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LocationService } from 'src/app/core/services/location/location.service';
import { MixpanelService } from 'src/app/core/services/mixpanel.service';
import { getPlaform } from 'src/app/core/utils/functions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AngularFireAnalytics],
})
export class LoginComponent implements OnInit {
  loginType: 'email' | 'phone' = 'phone';

  emailLoginForm!: FormGroup;
  phoneLoginForm!: FormGroup;

  countries$!: Observable<ICountry[]>;

  showPassword = false;
  showEmailFormPasswordField = false;
  showPhoneFormPasswordField = false;

  isLoadingEmail = false;

  returnUrl = '';

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertService: AlertService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private analytics: AngularFireAnalytics,
    private mixpanelService: MixpanelService
  ) {}

  get emailLoginFormData() {
    return this.emailLoginForm.value;
  }

  get emailLoginFormControls() {
    return this.emailLoginForm.controls;
  }

  get phoneLoginFormData() {
    return this.phoneLoginForm.value;
  }

  get phoneLoginFormControls() {
    return this.phoneLoginForm.controls;
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.countries$ = this.locationService
      .getCountries()
      .pipe(map((res) => res));
    this.initForm();
  }

  initForm() {
    this.emailLoginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      type: ['email'],
    });

    this.phoneLoginForm = this.fb.group({
      code: [null, [Validators.required]],
      phone: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      type: ['phone'],
    });
  }

  async onSubmitCheckUser(formPayload: any) {
    const loader = await this.loadingCtrl.create({
      message: '',
      animated: true,
      duration: 5000,
      spinner: 'lines-small',
      cssClass: 'loader',
    });
    const payload: ISignIn = {
      type: formPayload.type,
      ...(formPayload.email && { email: formPayload.email }),
      ...(formPayload.phone && {
        phone: `${formPayload.code}${formPayload.phone}`,
      }),
    };

    await loader.present();
    this.authService
      .check(payload)
      .pipe(
        finalize(async () => {
          await loader.dismiss();
        })
      )
      .subscribe({
        next: async (res) => {
          // this.alertService.success('User is found');

          if (res === null) {
            this.mixpanelService.track('Registeration Process', res);
            await this.alertService.success(
              `Verification code have been sent to ${
                payload.type === 'email' ? payload.email : payload.phone
              }`
            );
            this.navCtrl.navigateForward(
              [
                'auth/verify/',
                payload.type === 'email' ? payload.email : payload.phone,
              ],
              { queryParams: { type: payload.type } }
            );
          } else {
            this.mixpanelService.track('Login Process', res);
            if (payload.type === 'email') {
              this.emailLoginForm?.addControl(
                'password',
                new FormControl(null, [Validators.required])
              );
              this.showEmailFormPasswordField = true;
            } else {
              this.phoneLoginForm.addControl(
                'password',
                new FormControl(null, [Validators.required])
              );
              this.showPhoneFormPasswordField = true;
            }
          }
        },
        error: async (error: Error) => {
          this.mixpanelService.track('Registeration Error', error);
          await this.alertService.error(error.message);
        },
      });
  }

  async login(formPayload: any) {
    const loader = await this.loadingCtrl.create({
      message: '',
      animated: true,
      duration: 5000,
      spinner: 'lines-small',
      cssClass: 'loader',
    });
    const payload: ISignIn = {
      type: formPayload.type,
      password: formPayload.password,
      ...(formPayload.email && { email: formPayload.email }),
      ...(formPayload.phone && {
        phone: `${formPayload.code}${formPayload.phone}`,
      }),
    };

    await loader.present();
    this.authService
      .signin(payload)
      .pipe(
        finalize(async () => {
          await loader.dismiss();
        })
      )
      .subscribe({
        next: async (res) => {
          localStorage.setItem(
            STORAGE_VARIABLES.USER,
            JSON.stringify(res.metaData)
          );
          localStorage.setItem(STORAGE_VARIABLES.TOKEN, res.access_token);

          if (this.returnUrl !== '/') {
            this.goToReturnUrl(this.returnUrl);
          } else {
            this.goToHome();
          }
          this.emailLoginForm.reset();
          this.phoneLoginForm.reset();
          this.analytics.logEvent('login_sucessfull', {
            ...(payload.email && { email: payload.email }),
            ...(payload.phone && { phone: payload.phone }),
            platform: getPlaform(),
            ...(res.metaData.full_name && { name: res.metaData.full_name }),
          });
          this.mixpanelService.identify(res.metaData.id);
          this.mixpanelService.track('Login', res.metaData);
        },
        error: async (error: Error) => {
          this.mixpanelService.track('Login Error', error);
          await this.alertService.error(error.message);
          this.analytics.logEvent('login_failed', {
            ...(payload.email && { email: payload.email }),
            ...(payload.phone && { phone: payload.phone }),
            platform: getPlaform(),
          });
        },
      });
  }

  goToReturnUrl(url: string) {
    this.router.navigateByUrl(url);
  }

  goToHome() {
    this.router.navigate(['/admin/']);
  }
}
