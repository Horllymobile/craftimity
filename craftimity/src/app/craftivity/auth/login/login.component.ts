import { Component, OnInit } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { STORAGE_VARIABLES } from 'src/app/core/constants/storage';
import { ERole } from 'src/app/core/enums/role';
import { ISignIn } from 'src/app/core/models/auth';
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
    private router: Router
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
          this.sucess = 'Login successfully';
          if (res.metaData.role === ERole.USER) {
            this.validateLoggedInUser();
          } else {
            this.userService.userData.update((value) => (value = res.metaData));
            localStorage.setItem(
              STORAGE_VARIABLES.USER,
              JSON.stringify(res.metaData)
            );
            localStorage.setItem(STORAGE_VARIABLES.TOKEN, res.access_token);
            this.goToHome();
          }
          this.form.reset();
          this.analytics.logEvent('craftman_login_sucessfull', {
            ...(payload.email && { email: payload.email }),
            ...(payload.phone && { phone: payload.phone }),
            platform: getPlaform(),
            ...(res.metaData.full_name && { name: res.metaData.full_name }),
          });
          this.mixpanelService.identify(res.metaData.id);
          this.mixpanelService.track('craftman_login_sucessfull', res.metaData);
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

  validateLoggedInUser() {
    this.alertService.success(
      `Your account is currently listed as a user account. Would you like to become a Craftsman?`,
      undefined,
      [
        {
          text: 'No',
          handler: (value) => {
            this.userService.signout();
            this.goTo('/craftimity');
          },
        },
        {
          text: 'Yes',
          handler: (value) => {
            // this.goToHome();
          },
        },
      ]
    );
  }

  goTo(url: string) {
    this.router.navigateByUrl(url);
  }

  goToHome() {
    this.router.navigate(['/craftivity/pages/']);
  }
}
