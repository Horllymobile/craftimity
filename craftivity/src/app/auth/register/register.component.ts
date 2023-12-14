import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Observable, finalize, map } from 'rxjs';
import { TermsAndConditionsComponent } from 'src/app/components/terms-and-conditions/terms-and-conditions.component';
import { ICity, ICountry, IState } from 'src/app/core/models/location';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { LocationService } from 'src/app/core/services/location/location.service';

@Component({
  selector: 'craftivity-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  showPassword = false;
  showCPassword = false;

  countries$!: Observable<ICountry[]>;

  phoneDigitLength = 10;
  phoneDigitErrorText = 'ten (10)';
  phoneDigitSamplePlaceholder = '8095687112';

  constructor(
    private authService: AuthService,
    private loaderService: LoaderService,
    private locationService: LocationService,
    private router: Router,
    private alertService: AlertService,
    private modalController: ModalController
  ) {}
  get formData() {
    return this.form.value;
  }

  get formCtrl() {
    return this.form?.controls;
  }

  ngOnInit() {
    this.countries$ = this.locationService
      .getCountries()
      .pipe(map((res) => res));
    this.initForm();
  }

  initForm() {
    this.form = new FormGroup({
      first_name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      last_name: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      code: new FormControl(null, [Validators.required]),
      number: new FormControl(null, [
        Validators.required,
        Validators.minLength(this.phoneDigitLength),
        Validators.maxLength(this.phoneDigitLength),
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
      ]),
      accept: new FormControl(null, [Validators.required]),
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleCPassword() {
    this.showCPassword = !this.showCPassword;
  }

  isFormValid(form: FormGroup) {
    return form.valid && form.value.accept === true;
  }

  async onSubmit(payload: any) {
    const { accept, ...result } = payload;

    payload = {
      ...payload,
      phone: `${result.code}${result.number}`,
    };

    const loader = await this.loaderService.load();
    await loader.present();
    this.authService
      .registerCraftsman(result)
      .pipe(
        finalize(async () => {
          await loader.dismiss();
        })
      )
      .subscribe({
        next: (value) => {
          this.router.navigate(['/craftivity/auth/verify'], {
            queryParams: { email: payload.email },
          });
        },
        error: async (err) => {
          await this.alertService.error(err);
        },
      });
  }

  async openTermsAndConditionModal() {
    const modal = await this.modalController.create({
      component: TermsAndConditionsComponent,
    });

    await modal.present();
  }
}
