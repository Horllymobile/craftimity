import { Component, OnInit } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { finalize } from 'rxjs';
import { STORAGE_VARIABLES } from 'src/app/core/constants/storage';
import { ERole } from 'src/app/core/enums/role';
import { ILoginResponse, ISignIn } from 'src/app/core/models/auth';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MixpanelService } from 'src/app/core/services/mixpanel.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { getPlaform } from 'src/app/core/utils/functions';

@Component({
  selector: 'craftivity-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  showPassword = false;
  error = '';
  sucess = '';
  showError = false;
  constructor(
    private loaderService: LoaderService,
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UsersService,
    private analytics: AngularFireAnalytics,
    private mixpanelService: MixpanelService,
    private alertService: AlertService,
    private router: Router,
    private toastController: ToastController
  ) {}

  get formData() {
    return this.form.value;
  }

  get formControl() {
    return this.form.controls;
  }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      remember: [null],
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  async login(formPayload: any) {
    const payload: ISignIn = {
      type: 'email',
      password: formPayload?.password,
      email: formPayload?.email,
      remember: formPayload?.remember,
    };

    const loader = await this.loaderService?.load();
    await loader?.present();
    this.authService
      .signin(payload)
      .pipe(
        finalize(async () => {
          await loader.dismiss();
        })
      )
      .subscribe({
        next: async (res) => {
          if (res.metaData.role === ERole.USER) {
          } else {
            this.sucess = 'Login successfully';
            this.userService.userData.update((value) => (value = res.metaData));
            localStorage.setItem(
              STORAGE_VARIABLES.USER,
              JSON.stringify(res.metaData)
            );
            localStorage.setItem(STORAGE_VARIABLES.TOKEN, res.access_token);
            this.goToHome();

            this.form.reset();
            this.analytics.logEvent('craftman_login_sucessfull', {
              ...(payload.email && { email: payload.email }),
              ...(payload.phone && { phone: payload.phone }),
              platform: getPlaform(),
              ...(res.metaData.full_name && { name: res.metaData.full_name }),
            });
            this.mixpanelService.identify(res.metaData.id);
            this.mixpanelService.track(
              'craftman_login_sucessfull',
              res.metaData
            );
          }
        },
        error: async (error) => {
          console.log(error);
          this.showError = true;
          this.error = error;
          setTimeout(() => (this.showError = false), 5000);
          // await this.alertService.error(error);
          // this.mixpanelService.track('Login Error', error);
          // this.analytics.logEvent('login_failed', {
          //   ...(payload.email && { email: payload.email }),
          //   ...(payload.phone && { phone: payload.phone }),
          //   platform: getPlaform(),
          // });
        },
      });
  }

  async validateLoggedInUser(res: ILoginResponse) {
    const toast = await this.toastController.create({
      message: `Your account is currently not register as an artisan!`,
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
          text: 'Download Craftimity',
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

  goToHome() {
    this.router.navigate(['/']);
  }
}
