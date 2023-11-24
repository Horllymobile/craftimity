import { LoaderService } from 'src/app/core/services/loader.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IRegister } from 'src/app/core/models/auth';
import { Subject, finalize, takeUntil } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  showPassword = false;
  distroy$ = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService,
    private loaderService: LoaderService
  ) {}

  get formData() {
    return this.form.value;
  }

  get formCtrl() {
    return this.form.controls;
  }

  ngOnInit() {
    this.form = this.fb.group({
      first_name: [null, [Validators.required, Validators.minLength(3)]],
      last_name: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      accept: [null, Validators.required],
    });
  }

  isFormValid(form: FormGroup) {
    return form.valid && form.value.accept === true;
  }

  async register(formPayload: any) {
    const payload: IRegister = {
      first_name: formPayload.first_name,
      last_name: formPayload.last_name,
      email: formPayload.email,
      password: formPayload.password,
    };
    const loader = await this.loaderService.load();
    await loader.present();
    this.authService
      .register(payload)
      .pipe(
        takeUntil(this.distroy$),
        finalize(async () => await loader.dismiss())
      )
      .subscribe({
        next: (res) => {
          this.goToVerify(payload.email);
        },
        error: async (err) => {
          await this.alertService.error(err);
        },
      });
  }

  goToVerify(email?: string) {
    this.router.navigate(['/craftimity/page/auth/verify', email], {
      queryParams: {
        type: 'email',
      },
    });
  }

  ngOnDestroy(): void {
    this.distroy$.next();
    this.distroy$.complete();
  }
}
