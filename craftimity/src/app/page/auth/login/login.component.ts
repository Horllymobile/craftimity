import { Component, OnInit } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { Observable, finalize, map } from 'rxjs';
import { STORAGE_VARIABLES } from 'src/app/core/constants/storage';
import { ERole } from 'src/app/core/enums/role';
import { ILoginResponse, ISignIn } from 'src/app/core/models/auth';
import { ICountry } from 'src/app/core/models/location';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { LocationService } from 'src/app/core/services/location/location.service';
import { MixpanelService } from 'src/app/core/services/mixpanel.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { getPlaform } from 'src/app/core/utils/functions';

@Component({
  selector: 'craftimity-login',
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
    private userService: UsersService,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private router: Router,
    private analytics: AngularFireAnalytics,
    private mixpanelService: MixpanelService,
    private toastController: ToastController
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
      password: [null, [Validators.required]],
      remember: [null, [Validators.required]],
      type: ['email'],
    });

    // this.phoneLoginForm = this.fb.group({
    //   code: [null, [Validators.required]],
    //   password: [null, [Validators.required]],
    //   phone: [
    //     null,
    //     [
    //       Validators.required,
    //       Validators.minLength(10),
    //       Validators.maxLength(10),
    //     ],
    //   ],
    //   type: ['phone'],
    // });
  }

  async login(formPayload: any) {
    const load = await this.loaderService.load();
    const payload: ISignIn = {
      type: formPayload.type,
      password: formPayload.password,
      remember: formPayload.remember,
      email: formPayload.email,
      // ...(formPayload.email && { email: formPayload.email }),
      // ...(formPayload.phone && {
      //   phone: `${formPayload.code}${formPayload.phone}`,
      // }),
      // remember: formPayload.remember,
    };

    await load.present();
    this.authService
      .signin(payload)
      .pipe(
        finalize(async () => {
          await load.dismiss();
        })
      )
      .subscribe({
        next: async (res) => {
          if (res.metaData.role === ERole.CRAFTMAN) {
            this.validateLoggedInUser(res);
          } else {
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
          }

          this.emailLoginForm.reset();
          this.analytics.logEvent('login_sucessfull', {
            ...(payload.email && { email: payload.email }),
            ...(payload.phone && { phone: payload.phone }),
            platform: getPlaform(),
            ...(res.metaData.full_name && { name: res.metaData.full_name }),
          });
          this.mixpanelService.identify(res.metaData.id);
          this.mixpanelService.track('Login', {
            ...(payload.email && { email: payload.email }),
            ...(res.metaData.full_name && { name: res.metaData.full_name }),
          });
        },
        error: async (error) => {
          await this.alertService.error(error);
          this.mixpanelService.track('Login Error', { message: error });
          this.analytics.logEvent('login_failed', {
            message: error,
            ...(payload.email && { email: payload.email }),
            ...(payload.phone && { phone: payload.phone }),
            platform: getPlaform(),
          });
        },
      });
  }

  async validateLoggedInUser(res: ILoginResponse) {
    const toast = await this.toastController.create({
      message: `Download the Craftsmen App or Create Your Client Account Today!`,
      color: 'warning',
      cssClass: 'toast-message',
      buttons: [
        {
          text: 'Register',
          handler: () => {
            this.router.navigate(['/auth/register']);
          },
        },
        {
          text: 'Download',
          handler: () => {
            window.open('https://www.craftimity.com', '_blank');
          },
        },
      ],
      duration: 5000,
    });

    await toast.present();
  }

  goTo(url: string) {
    this.router.navigateByUrl(url);
  }

  goToReturnUrl(url: string) {
    this.router.navigateByUrl(url);
  }

  goToHome() {
    this.router.navigate(['/admin/']);
  }

  goToOnboarding() {
    this.router.navigate(['/admin/more/account']);
  }
}
