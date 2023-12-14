import { LoaderService } from 'src/app/core/services/loader.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, finalize, map } from 'rxjs';
import { STORAGE_VARIABLES } from 'src/app/core/constants/storage';
import { IForgotPassword, IVerifyOtp } from 'src/app/core/models/auth';
import { ICountry } from 'src/app/core/models/location';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LocationService } from 'src/app/core/services/location/location.service';
import { CustomValidators } from 'src/app/core/utils/custom-validators';

@Component({
  selector: 'craftimity-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit {
  type: 'email' | 'phone' = 'phone';

  emailLoginForm!: FormGroup;
  phoneLoginForm!: FormGroup;

  form!: FormGroup;
  changePasswordForm!: FormGroup;

  countries$!: Observable<ICountry[]>;

  showPassword = false;
  isSent = false;

  step: 'forgot' | 'verify' | 'change' = 'forgot';

  isLoadingEmail = false;

  returnUrl = '';

  verifySub$!: Subscription;
  constructor(
    private fb: FormBuilder,
    private locationService: LocationService,
    private authService: AuthService,
    private usersService: UsersService,
    private loaderService: LoaderService,
    private alertService: AlertService,
    private route: ActivatedRoute
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

  get formData() {
    return this.form.value;
  }

  get formControl() {
    return this.form.controls;
  }

  get changePasswordFormData() {
    return this.changePasswordForm.value;
  }

  get changePasswordFormControl() {
    return this.changePasswordForm.controls;
  }

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.countries$ = this.locationService
      .getCountries()
      .pipe(map((res) => res));
    this.initForm();
  }

  async onSubmitForgotPassword(formPayload: any) {
    const loader = await this.loaderService.load();

    const payload: IForgotPassword = {
      type: formPayload.type,
      ...(formPayload.type === 'email' && { email: formPayload.email }),
      ...(formPayload.type === 'phone' && { phone: formPayload.phone }),
    };

    await loader.present();
    this.authService
      .forgotPassword(payload)
      .pipe(
        finalize(async () => {
          await loader.dismiss();
        })
      )
      .subscribe({
        next: async (res) => {
          this.step = 'verify';
          localStorage.setItem(
            STORAGE_VARIABLES.FORGOT_PASSWORD_DATA,
            JSON.stringify(res.data)
          );
          await this.alertService.success(res.message);
        },
        error: async (err) => {
          await this.alertService.error(err?.error?.message);
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
      type: this.type,
      code: formPayload['code'],
      ...(this.type === 'email' && { email: data?.email }),
      ...(this.type === 'phone' && { phone: data?.email }),
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

  checkPasswords(group: FormGroup): any {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('cmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
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
          await this.alertService.success(res, '/auth/login');
        },
        error: async (err) => {
          await this.alertService.error(err?.message);
        },
      });
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

    this.form = this.fb.group({
      code: [
        null,
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
    });

    this.changePasswordForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      cmPassword: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.changePasswordFormControl['cmPassword'].addValidators(
      CustomValidators.matchingPasswords()
    );
  }
}
