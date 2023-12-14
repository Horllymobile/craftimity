import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { IVerifyOtp } from 'src/app/core/models/auth';
import { LoadingController } from '@ionic/angular';
import { Subscription, finalize, interval } from 'rxjs';
import { AlertService } from 'src/app/core/services/alert.service';

@Component({
  selector: 'craftivity-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent implements OnInit {
  form!: FormGroup;
  email: string = '';
  timer = 60;
  isResending = false;
  resetSub$!: Subscription;
  intervalSub$!: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertService: AlertService
  ) {}

  get formCtrl() {
    return this.form.controls;
  }

  get formValue() {
    return this.form.value;
  }

  ngOnInit() {
    const param = this.activatedRoute.snapshot.queryParamMap.get('email');
    if (param) {
      this.email = param;
    }
    this.startTimer();
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      code: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ]),
    });
  }

  async onSubmit(form: any) {
    const payload: IVerifyOtp = {
      code: form.code,
      type: 'email',
      email: this.email,
    };
    const loader = await this.loadingCtrl.create({
      message: '',
      animated: true,
      duration: 5000,
      spinner: 'lines-small',
      cssClass: 'loader',
    });
    await loader.present();
    this.authService
      .verifyCraftman(payload)
      .pipe(
        finalize(async () => {
          await loader.dismiss();
        })
      )
      .subscribe({
        next: (res) => {
          this.router.navigate(['/craftivity/auth/login']);
        },
        error: async (err) => {
          await this.alertService.error(err);
        },
      });
  }

  async resendOTPCode() {
    this.isResending = true;
    let payload = {
      type: 'email',
      email: this.email,
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
}
