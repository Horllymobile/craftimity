import { AlertService } from './../../../core/services/alert.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, finalize, map } from 'rxjs';
import { ICity, ICountry, IState } from 'src/app/core/models/location';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { LocationService } from 'src/app/core/services/location/location.service';
import { CustomValidators } from 'src/app/core/utils/custom-validators';

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
  states$!: Observable<IState[]>;
  cities$!: Observable<ICity[]>;
  constructor(
    private authService: AuthService,
    private loaderService: LoaderService,
    private locationService: LocationService,
    private router: Router,
    private alertService: AlertService
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
      first_name: new FormControl(null, [Validators.required]),
      last_name: new FormControl(null, [Validators.required]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required]),
      accept: new FormControl(null, [Validators.required]),
    });
  }

  onSelectCountry({ detail: { value } }: any) {
    this.states$ = this.locationService
      .getStates({ country: value })
      .pipe(map((res) => res));
  }

  onSelectState({ detail: { value } }: any) {
    this.cities$ = this.locationService
      .getCities({ state: value })
      .pipe(map((res) => res));
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
}
