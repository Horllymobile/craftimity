import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
} from "ngx-image-cropper";
import { ToastrService } from "ngx-toastr";
import { Observable, Subscription, finalize, interval, map } from "rxjs";
import { EContactType, EOnboardingStep } from "src/app/core/enums/auth";
import {
  ISignIn,
  IUpdateUser,
  IVerifyPhoneOtp,
} from "src/app/core/models/auth";
import { ICity, ICountry, IState } from "src/app/core/models/location";
import { IUser } from "src/app/core/models/user";
import { AuthService } from "src/app/core/services/auth/auth.service";
import { CityService } from "src/app/core/services/city/city.service";
import { CountryService } from "src/app/core/services/country/country.service";
import { StateService } from "src/app/core/services/state/state.service";
import { SupaBaseService } from "src/app/core/services/supabase.service";

@Component({
  selector: "craft-onboarding",
  templateUrl: "./onboarding.component.html",
  styleUrls: ["./onboarding.component.scss"],
})
export class OnboardingComponent implements OnInit, OnDestroy {
  querySub$!: Subscription;
  email!: string | null;
  phone!: string | null;
  type!: string | null;
  countries$!: Observable<ICountry[]>;
  states$!: Observable<IState[]>;
  cities$!: Observable<ICity[]>;
  phoneForm!: FormGroup;
  emailForm!: FormGroup;
  otpForm!: FormGroup;
  imageForm!: FormGroup;
  form!: FormGroup;
  isLoadingPhoneVerifcation = false;
  isLoadingEmailVerifcation = false;
  isVerifyingOtp = false;
  steps!: EOnboardingStep;
  EOnboardingStep = EOnboardingStep;
  verifySub$!: Subscription;
  timer = 60;
  intervalSub$!: Subscription;

  isUploadingImage = false;
  isUpdatingUser = false;

  imageChangedEvent: any = "";
  containWithinAspectRatio = false;
  croppedImage: any = "";
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  transform: ImageTransform = {};

  userData!: IUser;

  showPassword = false;

  constructor(
    private router: ActivatedRoute,
    private fb: FormBuilder,
    private countryService: CountryService,
    private stateService: StateService,
    private cityService: CityService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private supabaseService: SupaBaseService,
    private route: Router
  ) {
    this.userData = JSON.parse(localStorage.getItem("USER") || "") as IUser;
  }

  get phoneFormControl() {
    return this.phoneForm.controls;
  }

  get phoneFormData() {
    return this.phoneForm.value;
  }

  get emailFormControl() {
    return this.emailForm.controls;
  }

  get emailFormData() {
    return this.emailForm.value;
  }

  get imageFormControl() {
    return this.imageForm.controls;
  }

  get imageFormData() {
    return this.imageForm.value;
  }

  get formControl() {
    return this.form.controls;
  }

  get formData() {
    return this.form.value;
  }

  ngOnInit(): void {
    this.getInfo();
    this.countries$ = this.countryService
      .getCountries()
      .pipe(map((res) => res));
    this.initForm();
  }

  initForm() {
    this.phoneForm = this.fb.group({
      code: [null, [Validators.required]],
      phone: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
    });
    this.emailForm = this.fb.group({
      email: [null, [Validators.required, Validators.email]],
    });
    this.otpForm = this.fb.group({
      code: [null, [Validators.required]],
    });
    this.imageForm = this.fb.group({
      url: [null, [Validators.required]],
    });

    this.form = this.fb.group({
      firstName: [null, [Validators.required]],
      lastName: [null, [Validators.required]],
      birthdate: [null, [Validators.required]],
      password: [null, [Validators.required]],
      country: [null, [Validators.required]],
      state: [null, [Validators.required]],
      city: [null, [Validators.required]],
      address: [null, [Validators.required]],
      address2: [null, []],
      accept: [null, [Validators.required]],
    });
  }

  onShowPassword() {
    this.showPassword = !this.showPassword;
  }

  isFormValid(form: FormGroup) {
    return form.valid && form.value.accept === true;
  }

  onSubmitPhoneNumber(formPayload: { [key: string]: AbstractControl }) {
    this.isLoadingPhoneVerifcation = true;
    const payload: ISignIn = {
      phone: `${formPayload["code"]}${formPayload["phone"]}`,
      type: EContactType.PHONE,
    };
    this.authService
      .resendOTPCode(payload)
      .pipe(finalize(() => (this.isLoadingPhoneVerifcation = false)))
      .subscribe({
        next: (res) => {
          this.toastrService.success(res);
          this.steps = EOnboardingStep.OTP_VERIFICATION_PHONE;
          this.startTimer();
        },
        error: (err) => {
          console.log(err);
          this.toastrService.error(err.message);
        },
      });
  }

  onSubmitEmail(formPayload: { [key: string]: AbstractControl }) {
    this.isLoadingEmailVerifcation = true;
    const payload: ISignIn = {
      email: `${formPayload["email"]}`,
      type: EContactType.EMAIL,
    };
    this.authService
      .resendOTPCode(payload)
      .pipe(finalize(() => (this.isLoadingEmailVerifcation = false)))
      .subscribe({
        next: (res) => {
          this.toastrService.success(res);
          this.steps = EOnboardingStep.OTP_VERIFICATION_EMAIL;
          this.startTimer();
        },
        error: (err) => {
          console.log(err);
          this.toastrService.error(err.message);
        },
      });
  }

  verifyOtpPhone(formPayload: { [key: string]: string }) {
    this.isVerifyingOtp = true;
    const payload: IVerifyPhoneOtp = {
      email: `${this.email}`,
      code: formPayload["code"],
      phone: `${this.phoneFormData["code"]}${this.phoneFormData["phone"]}`,
    };
    this.verifySub$ = this.authService
      .verifyPhoneOtp(payload)
      .pipe(
        finalize(() => {
          this.isVerifyingOtp = false;
        })
      )
      .subscribe({
        next: (res) => {
          this.toastrService.success(res.message);
          this.steps = EOnboardingStep.IMAGE_UPLOAD;
        },
        error: (err) => {
          this.toastrService.error(err.message);
        },
      });
  }

  verifyOtpEmail(formPayload: { [key: string]: string }) {
    this.isVerifyingOtp = true;
    const payload: IVerifyPhoneOtp = {
      phone: `${this.phone}`,
      code: formPayload["code"],
      email: `${this.emailFormData["email"]}`,
    };
    this.verifySub$ = this.authService
      .verifyEmailOtp(payload)
      .pipe(
        finalize(() => {
          this.isVerifyingOtp = false;
        })
      )
      .subscribe({
        next: (res) => {
          this.toastrService.success(res.message);
          this.steps = EOnboardingStep.IMAGE_UPLOAD;
        },
        error: (err) => {
          this.toastrService.error(err.message);
        },
      });
  }

  getInfo() {
    this.querySub$ = this.router.queryParamMap.subscribe({
      next: (res) => {
        if (res.has("email") && res.has("type")) {
          this.email = res.get("email");
          this.steps = EOnboardingStep.COMPLETE;
          // this.steps = EOnboardingStep.PHONE_VERIFICATION;
        } else if (res.has("phone") && res.has("type")) {
          this.phone = res.get("phone");
          // this.steps = EOnboardingStep.COMPLETE;
          this.steps = EOnboardingStep.EMAIL_VERIFICATION;
        }
        this.type = res.get("type");
      },
    });
  }

  onSelectCountry(country: number) {
    console.log(country);
    this.states$ = this.stateService
      .getStates({ country })
      .pipe(map((res) => res));
  }

  onSelectState(state: number) {
    console.log(state);
    this.cities$ = this.cityService
      .getCities({ state })
      .pipe(map((res) => res));
  }

  ngOnDestroy(): void {
    this.querySub$?.unsubscribe();
  }

  startTimer() {
    if (this.timer < 1) this.timer = 60;
    this.intervalSub$ = interval(1000).subscribe({
      next: (res) => {
        this.timer -= 1;
        if (this.timer === 0) this.intervalSub$.unsubscribe();
      },
    });
  }

  deleteImage() {
    this.imageChangedEvent = "";
    this.imageForm.reset();
  }

  uploadImage(event: any) {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.blob;
  }

  async submitImage() {
    this.isUploadingImage = true;
    const url = await this.supabaseService.uploadFile(this.croppedImage);
    if (url) {
      this.updateImage(url);
    }
  }

  async updateUser(formData: { [key: string]: string }) {
    this.isUpdatingUser = true;
    const payload: IUpdateUser = {
      first_name: formData["firstName"],
      last_name: formData["lastName"],
      birthdate: formData["birthdate"],
      password: formData["password"],
      address: formData["address"],
      country: Number(formData["country"]),
      state: Number(formData["state"]),
      city: Number(formData["city"]),
    };
    console.log(payload);
    this.authService
      .updateUser(this.userData.id, payload)
      .pipe(finalize(() => (this.isUpdatingUser = false)))
      .subscribe({
        next: (res) => {
          this.form.reset();
          this.route.navigateByUrl("/auth/login");
          this.toastrService.success(res);
        },
        error: (err) => {
          this.toastrService.error(err.message);
        },
      });
  }

  updateImage(url: string) {
    console.log(url);
    this.authService
      .updateImageUrl(this.userData?.id, {
        profile_image: url,
      })
      .pipe(finalize(() => (this.isUploadingImage = false)))
      .subscribe({
        next: (res) => {
          this.toastrService.success(res);
          this.steps = EOnboardingStep.COMPLETE;
        },
        error: (err) => {
          this.toastrService.error(err.message);
        },
      });
  }

  imageLoaded() {
    this.showCropper = true;
    console.log("Image loaded");
  }

  cropperReady(sourceDimentions: Dimensions) {
    console.log("Cropper Ready", sourceDimentions);
  }

  loadImageFail() {
    console.log("Load Image Fail");
  }
}
