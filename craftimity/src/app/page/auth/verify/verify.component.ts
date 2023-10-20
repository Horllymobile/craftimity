import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription, finalize, map } from 'rxjs';
import { EContactType } from 'src/app/core/enums/auth';
import { IVerifyOtp } from 'src/app/core/models/auth';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-verify',
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
  constructor(
    private fb: FormBuilder,
    private router: ActivatedRoute,
    private authService: AuthService,
    private route: Router,
    private loadingCtrl: LoadingController
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
  }

  submit() {}

  async verifyOtp(formPayload: { [key: string]: string }) {
    const loader = await this.loadingCtrl.create({
      message: '',
      animated: true,
      duration: 5000,
      spinner: 'lines-small',
      cssClass: 'loader',
    });
    const payload: IVerifyOtp = {
      type: this.type,
      code: formPayload['code'],
      ...(this.type === 'email' && { email: this.data }),
      ...(this.type === 'phone' && { phone: this.data }),
    };

    await loader.present();
    this.verifySub$ = this.authService
      .verifyOtp(payload)
      .pipe(
        finalize(async () => {
          await loader.dismiss();
        })
      )
      .subscribe({
        next: (res) => {
          localStorage.setItem('USER', JSON.stringify(res.data));
          this.route.navigate(['/auth/onboarding'], {
            queryParams: {
              email: payload.email,
              type: payload.type,
            },
          });
        },
        error: (err) => {
          console.log(err);
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

  ngOnDestroy(): void {
    this.paramSub$?.unsubscribe();
    this.querySub$?.unsubscribe();
  }
}
