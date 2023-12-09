import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { CountryService } from "./../../core/services/country/country.service";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable, Subject, finalize, map, takeUntil } from "rxjs";
import { ICountry } from "src/app/core/models/location";
import { Router } from "@angular/router";

@Component({
  selector: "craft-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  showPassword = false;
  isLoading = false;
  countries$!: Observable<ICountry[]>;
  distroy$ = new Subject<void>();
  constructor(
    private fb: FormBuilder,
    private countryService: CountryService,
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  get formCtrl() {
    return this.form.controls;
  }

  get formPhoneGroup() {
    return this.form.controls["phone"] as FormGroup;
  }

  ngOnInit(): void {
    this.countries$ = this.countryService
      .getCountries()
      .pipe(map((res) => res));

    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      first_name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      phone: this.fb.group({
        code: [null, [Validators.required]],
        number: [
          null,
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
          ],
        ],
      }),
      agree: [null, [Validators.required]],
      is_artisan: [null, [Validators.required]],
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  onShowPassword() {
    this.showPassword = !this.showPassword;
  }

  isFormValid(form: FormGroup) {
    return form.valid && form.value.agree === true;
  }

  onSubmit(formpayload: any) {
    this.isLoading = true;
    const payload = {
      ...formpayload,
      phone: `${formpayload.phone.code}${formpayload.phone.number}`,
    };

    console.log(payload);
    this.authService
      .register(payload)
      .pipe(
        finalize(() => (this.isLoading = false)),
        takeUntil(this.distroy$)
      )
      .subscribe({
        next: (res) => {
          console.log(res);
          this.toastrService.success(res.message);
          this.router.navigate(["auth/verify-email/", payload.email]);
        },
        error: (err) => {
          console.log(err);
          this.toastrService.error(err);
        },
      });
  }

  ngOnDestroy(): void {
    this.distroy$.next();
    this.distroy$.complete();
  }
}
