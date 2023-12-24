import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Observable, Subject, finalize, map, takeUntil } from 'rxjs';
import { STORAGE_VARIABLES } from 'src/app/core/constants/storage';
import { ERole } from 'src/app/core/enums/role';
import { ILoginResponse, ISignIn } from 'src/app/core/models/auth';
import { ICountry } from 'src/app/core/models/location';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { LocationService } from 'src/app/core/services/location/location.service';
import { MixpanelService } from 'src/app/core/services/mixpanel.service';
import { getPlaform } from 'src/app/core/utils/functions';

@Component({
  selector: 'craftimity-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AngularFireAnalytics],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginType: 'email' | 'phone' = 'phone';

  emailLoginForm!: FormGroup;
  phoneLoginForm!: FormGroup;

  countries$!: Observable<ICountry[]>;

  showPassword = false;
  showEmailFormPasswordField = false;
  showPhoneFormPasswordField = false;

  isLoadingEmail = false;

  returnUrl = '';

  destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private authService: AuthService,
    private loaderService: LoaderService,
    private alertService: AlertService,
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
      remember: [null],
      type: ['email'],
    });
  }

  async login(formPayload: any) {
    const load = await this.loaderService.load();
    const payload: ISignIn = {
      type: formPayload.type ?? 'email',
      password: formPayload.password,
      remember: formPayload.remember ?? false,
      email: formPayload.email.toLocaleLowerCase(),
    };

    await load.present();
    this.authService
      .signin(payload)
      .pipe(
        finalize(async () => {
          await load.dismiss();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: async (res) => {
          if (res.metaData.role === ERole.CRAFTMAN) {
            await this.validateLoggedInUser(res);
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
            ...(res.metaData.email && { email: res.metaData.email }),
            ...(res.metaData.phone_number && {
              phone: res.metaData.phone_number,
            }),
            platform: getPlaform(),
            role: res.metaData.role,
          });

          this.mixpanelService.identify(res.metaData.id);
          this.mixpanelService.track('Login', {
            ...(res.metaData.email && { email: res.metaData.email }),
            ...(res.metaData.phone_number && {
              phone: res.metaData.phone_number,
            }),
            platform: getPlaform(),
            role: res.metaData.role,
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

  ngOnDestroy(): void {
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
}
