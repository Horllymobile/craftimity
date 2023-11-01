import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, map } from "rxjs";
import { EContactType, ELogin } from "src/app/core/enums/auth";
import { ISignIn } from "src/app/core/models/auth";
import { ICountry } from "src/app/core/models/location";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { CountryService } from "src/app/core/services/country/country.service";

@Component({
  selector: "con-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"],
})
export class LoginPageComponent implements OnInit {
  openLoginWithEmail = true;
  openLoginWithPhone = false;

  emailLoginForm!: FormGroup;
  phoneLoginForm!: FormGroup;

  isLoadingEmail = false;
  isLoadingPhone = false;

  countries$!: Observable<ICountry[]>;

  showPasswordInput = false;
  showPassword = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private countryService: CountryService,
    private authService: AuthService,
    private router: Router,
    private toastrService: ToastrService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.countries$ = this.countryService
      .getCountries()
      .pipe(map((res) => res));
  }

  get emailLoginFormControl() {
    return this.emailLoginForm.controls;
  }

  get emailLoginFormData() {
    return this.emailLoginForm.value;
  }

  get phoneLoginFormData() {
    return this.phoneLoginForm.value;
  }

  get phoneLoginFormControl() {
    return this.phoneLoginForm.controls;
  }

  initForm() {
    this.emailLoginForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
      type: ["email"],
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
      type: ["phone"],
    });
  }

  onShowPassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit(formPayload: { [key: string]: AbstractControl }) {
    console.log(formPayload);
  }

  onSubmitEmail(formPayload: { [key: string]: AbstractControl }) {
    this.isLoadingEmail = true;
    const payload: ISignIn = {
      type: EContactType.EMAIL,
      email: formPayload["email"].value,
    };
    this.authService.sigin(payload).subscribe({
      next: (res) => {
        if (res === null) {
          this.toastrService.success(
            `Verification code have been sent to ${payload.email}`
          );
          this.router.navigate(["auth/verify-email/", payload.email]);
        } else {
          this.emailLoginForm?.addControl("password", [
            null,
            [Validators.required],
          ]);
          this.showPasswordInput = true;
        }
        this.isLoadingEmail = false;
      },
      error: (err) => {
        console.log(err);
        this.toastrService.error(err.message);
        this.isLoadingEmail = false;
      },
    });
  }

  onSubmitPhone(formPayload: { [key: string]: AbstractControl }) {
    this.isLoadingPhone = true;
    const payload: ISignIn = {
      type: EContactType.PHONE,
      phone: `${formPayload["code"].value}${formPayload["phone"].value}`,
    };
    this.authService.sigin(payload).subscribe({
      next: (res) => {
        if (res === null) {
          this.toastrService.success(
            `Verification code have been sent to ${payload.phone}`
          );
          this.router.navigate(["auth/verify-phone/", payload.phone]);
        } else {
          this.phoneLoginForm.addControl("password", [
            null,
            [Validators.required],
          ]);
          this.showPasswordInput = true;
        }
        this.isLoadingPhone = false;
      },
      error: (err) => {
        this.isLoadingPhone = false;
        console.log(err);
        this.toastrService.error(err.message);
      },
    });
  }

  toogle() {
    if (this.route.snapshot.url.find((value) => value.path !== "/login")) {
      this.openLoginWithEmail = !this.openLoginWithEmail;
      this.openLoginWithPhone = !this.openLoginWithPhone;
    }
  }
}
