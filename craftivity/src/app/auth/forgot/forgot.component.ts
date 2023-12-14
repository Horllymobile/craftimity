import { UsersService } from 'src/app/core/services/users/users.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription, finalize, interval } from 'rxjs';
import { STORAGE_VARIABLES } from 'src/app/core/constants/storage';
import { IForgotPassword, IVerifyOtp } from 'src/app/core/models/auth';
import { CustomValidators } from 'src/app/core/utils/custom-validators';
import { AlertService } from 'src/app/core/services/alert.service';
import { LoaderService } from 'src/app/core/services/loader.service';

@Component({
  selector: 'craftivity-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
})
export class ForgotComponent implements OnInit {
  timer = 60;
  step = 'forgot';
  form!: FormGroup;
  verifyForm!: FormGroup;
  changePasswordForm!: FormGroup;
  isResending = false;
  intervalSub$!: Subscription;
  resetSub$!: Subscription;
  verifySub$!: Subscription;
  showPassword = false;
  constructor(
    private authService: AuthService,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private usersService: UsersService
  ) {}

  ngOnInit() {
    this.initForm();
  }

  get verifyFormCtrl() {
    return this.verifyForm.controls;
  }

  get formCtrl() {
    return this.verifyForm.controls;
  }

  get changePasswordFormCtrl() {
    return this.verifyForm.controls;
  }

  initForm() {
    this.form = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
    });

    this.verifyForm = new FormGroup({
      code: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ]),
    });

    this.changePasswordForm = new FormGroup({
      password: new FormControl(null, [Validators.required]),
      cmPassword: new FormControl(null, [Validators.required]),
    });

    this.changePasswordForm.addValidators([
      CustomValidators.matchingPasswords(),
    ]);
  }

  async onSubmit(payload: any) {
    const loader = await this.loaderService.load();
    await loader.present();
    this.authService
      .forgotPassword({ type: 'email', email: payload.email })
      .pipe(
        finalize(async () => {
          await loader.dismiss();
        })
      )
      .subscribe({
        next: async (res) => {
          await this.alertService.success(res.message);
          this.step = 'verify';
          localStorage.setItem(
            STORAGE_VARIABLES.FORGOT_PASSWORD_DATA,
            JSON.stringify(res.data)
          );
          this.startTimer();
        },
        error: async (err) => {
          await this.alertService.error(err);
        },
      });
  }

  async verifyOtp(formPayload: any) {
    const loader = await this.loaderService.load();

    const stored = localStorage.getItem(STORAGE_VARIABLES.FORGOT_PASSWORD_DATA);
    let data: any;
    if (stored) {
      data = JSON.parse(stored ? stored : '');
    }

    const payload: IVerifyOtp = {
      type: 'email',
      code: formPayload.code,
      email: this.form.value.email,
    };

    await loader.present();
    this.verifySub$ = this.authService
      .verifyForgotPasswordOtp(payload)
      .pipe(
        finalize(async () => {
          await loader.dismiss();
        })
      )
      .subscribe({
        next: async (res) => {
          this.step = 'change';
          localStorage.removeItem(STORAGE_VARIABLES.FORGOT_PASSWORD_DATA);
          localStorage.setItem(
            STORAGE_VARIABLES.USER,
            JSON.stringify(res.user)
          );
          localStorage.setItem(
            STORAGE_VARIABLES.FORGOT_PASSWORD_TOKEN,
            res.token
          );
        },
        error: async (err) => {
          await this.alertService.error(err?.message);
        },
      });
  }

  async updatePassword(formPayload: any) {
    const loader = await this.loaderService.load();

    const stored = localStorage.getItem(STORAGE_VARIABLES.USER);
    let data: any;
    if (stored) {
      data = JSON.parse(stored ? stored : '');
    }

    const payload = {
      password: formPayload['password'],
    };

    await loader.present();
    this.verifySub$ = this.usersService
      .updatePassword(data.id, payload)
      .pipe(
        finalize(async () => {
          await loader.dismiss();
        })
      )
      .subscribe({
        next: async (res) => {
          localStorage.removeItem(STORAGE_VARIABLES.FORGOT_PASSWORD_TOKEN);
          await this.alertService.success(res, '/craftivity/auth/login');
        },
        error: async (err) => {
          await this.alertService.error(err?.message);
        },
      });
  }

  async resendOTPCode() {
    this.isResending = true;
    let payload: IForgotPassword = {
      type: 'email',
      email: this.form.value.email,
    };
    const loader = await this.loaderService.load();
    await loader.present();
    this.resetSub$ = this.authService
      .forgotPassword(payload)
      .pipe(
        finalize(async () => {
          this.startTimer();
          await loader.dismiss();
        })
      )
      .subscribe({
        next: async (res) => {
          await this.alertService.success(res.message);
        },
        error: async (err) => {
          await this.alertService.error(err);
        },
      });
  }

  startTimer() {
    if (this.timer < 1) this.timer = 60;
    this.intervalSub$ = interval(1000)
      .pipe()
      .subscribe((res) => {
        this.timer -= 1;
        if (this.timer <= 0) {
          this.intervalSub$.unsubscribe();
          this.timer = 0;
        }
      });
  }
}
