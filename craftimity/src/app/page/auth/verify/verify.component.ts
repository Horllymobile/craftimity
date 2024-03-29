import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription, finalize, interval, map } from 'rxjs';
import { STORAGE_VARIABLES } from 'src/app/core/constants/storage';
import { ISignIn, IVerifyOtp } from 'src/app/core/models/auth';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'craftimity-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent implements OnInit, OnDestroy {
  data = '';
  type = '';
  form!: FormGroup;
  paramSub$!: Subscription;
  querySub$!: Subscription;
  verifySub$!: Subscription;
  timer = 60;
  intervalSub$!: Subscription;
  resetSub$!: Subscription;
  isResending = false;
  constructor(
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private authService: AuthService,
    private route: Router,
    private loadingCtrl: LoadingController,
    private alertService: AlertService
  ) {}

  get formData() {
    return this.form.value;
  }

  get formControl() {
    return this.form.controls;
  }

  ngOnInit() {
    this.form = this.fb.group({
      code: [
        null,
        [Validators.required, Validators.minLength(6), Validators.maxLength(6)],
      ],
    });

    this.getRouteDetails();
    this.startTimer();
  }

  async verifyOtp(formPayload: { [key: string]: string }) {
    const loader = await this.loadingCtrl.create({
      message: '',
      animated: true,
      duration: 5000,
      spinner: 'lines-small',
      cssClass: 'loader',
    });
    await loader.present();
    const payload: IVerifyOtp = {
      type: this.type,
      code: formPayload['code'],
      ...(this.type === 'email' && { email: this.data }),
      ...(this.type === 'phone' && { phone: this.data }),
    };
    this.verifySub$ = this.authService
      .verifyOtp(payload)
      .pipe(
        finalize(async () => {
          await loader.dismiss();
        })
      )
      .subscribe({
        next: async (res) => {
          localStorage.removeItem(STORAGE_VARIABLES.SIGNUP_DATA);
          this.route.navigate(['/pages/login']);
        },
        error: async (err) => {
          await this.alertService.error(err);
        },
      });
  }

  getRouteDetails() {
    this.querySub$ = this.router.paramMap
      .pipe(
        map((res) => {
          const data = res.get('data');
          if (data) {
            this.data = data;
          }
          return res.get('data');
        })
      )
      .subscribe();

    this.paramSub$ = this.router.queryParamMap
      .pipe(
        map((res) => {
          const type = res.get('type');
          if (type) {
            this.type = type;
          }
          return res.get('type');
        })
      )
      .subscribe();
  }

  async resendOTPCode() {
    this.isResending = true;
    let payload: ISignIn = {
      type: this.type,
      ...(this.type === 'email' && { email: this.data }),
      ...(this.type === 'phone' && { phone: this.data }),
    };
    const loader = await this.loadingCtrl.create({
      message: '',
      animated: true,
      duration: 5000,
      spinner: 'lines-small',
      cssClass: 'loader',
    });
    await loader.present();
    this.resetSub$ = this.authService
      .resendOTPCode(payload)
      .pipe(
        finalize(async () => {
          this.startTimer();
          await loader.dismiss();
        })
      )
      .subscribe({
        next: async (res) => {
          await this.alertService.success(res);
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

  ngOnDestroy(): void {
    this.paramSub$?.unsubscribe();
    this.querySub$?.unsubscribe();
  }
}
