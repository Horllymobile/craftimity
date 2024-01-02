import { ModalController } from '@ionic/angular';
import { LocationService } from 'src/app/core/services/location/location.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IRegister } from 'src/app/core/models/auth';
import { Observable, Subject, finalize, map, takeUntil } from 'rxjs';
import { ICountry } from 'src/app/core/models/location';
import { TermsAndConditionsComponent } from 'src/app/components/terms-and-conditions/terms-and-conditions.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  showPassword = false;
  distroy$ = new Subject<void>();

  phoneDigitLength = 10;
  phoneDigitErrorText = 'ten (10)';
  phoneDigitSamplePlaceholder = '8095687112';

  countries$!: Observable<ICountry[]>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private locationService: LocationService,
    private modalController: ModalController
  ) {}

  get formData() {
    return this.form.value;
  }

  get formCtrl() {
    return this.form.controls;
  }

  ngOnInit() {
    this.countries$ = this.locationService
      .getCountries()
      .pipe(map((res) => res));
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      first_name: [null, [Validators.required, Validators.minLength(3)]],
      last_name: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      code: [null, [Validators.required]],
      number: [
        null,
        [
          Validators.required,
          Validators.minLength(this.phoneDigitLength),
          Validators.maxLength(this.phoneDigitLength),
        ],
      ],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
        ],
      ],
      accept: [null, Validators.required],
    });
  }

  isFormValid(form: FormGroup) {
    return form.valid && form.value.accept === true;
  }

  async register(formPayload: any) {
    ''.toLocaleLowerCase();
    const payload: IRegister = {
      first_name: formPayload.first_name,
      last_name: formPayload.last_name,
      email: formPayload.email?.toLocaleLowerCase(),
      phone: `${formPayload.code}${formPayload.number}`,
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
    this.router.navigate(['/pages/verify', email], {
      queryParams: {
        type: 'email',
      },
    });
  }

  async openTermsAndConditionModal() {
    const modal = await this.modalController.create({
      component: TermsAndConditionsComponent,
      initialBreakpoint: 1,
    });

    await modal.present();
  }

  ngOnDestroy(): void {
    this.distroy$.next();
    this.distroy$.complete();
  }
}
