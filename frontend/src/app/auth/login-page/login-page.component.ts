import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, finalize, map } from "rxjs";
import { STORAGE_VARIABLES } from "src/app/core/constants/storage";
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
  login_type = "email";

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
      email: ["kogiboi12@gmail.com", [Validators.required, Validators.email]],
      password: [
        "horlly442",
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(16),
        ],
      ],
      type: ["email"],
    });

    this.phoneLoginForm = this.fb.group({
      code: [null, [Validators.required]],
      password: [
        null,
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16),
      ],
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

  onSubmitEmail(formPayload: any) {
    this.isLoadingEmail = true;
    const payload: ISignIn = {
      type: EContactType.EMAIL,
      password: formPayload.password,
      email: formPayload.email,
    };
    this.authService
      .sigin(payload)
      .pipe(finalize(() => (this.isLoadingEmail = false)))
      .subscribe({
        next: (res) => {
          this.authService.isAuth.update(
            (value) =>
              (value = this.authService.isAuthenticatedT(res.data.access_token))
          );
          localStorage.setItem(
            STORAGE_VARIABLES.USER,
            JSON.stringify(res.data.metaData)
          );
          localStorage.setItem(STORAGE_VARIABLES.TOKEN, res.data.access_token);
          this.toastrService.success(res.message);
          this.router.navigate(["/home"]);
        },
        error: (err) => {
          this.toastrService.error(err);
        },
      });
  }

  onSubmitPhone(formPayload: any) {
    this.isLoadingPhone = true;
    const payload: ISignIn = {
      type: EContactType.PHONE,
      phone: `${formPayload.code}${formPayload.phone}`,
      password: formPayload.password,
    };
    this.authService.sigin(payload).subscribe({
      next: (res) => {
        if (res === null) {
          this.toastrService.success(
            `Verification code have been sent to ${payload.phone}`
          );
          this.router.navigate(["auth/verify-phone/", payload.phone]);
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

  onLoginWith(type: "email" | "phone") {
    this.login_type = type;
  }
}
