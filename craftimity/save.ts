import { AlertService } from './src/app/core/services/alert.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Camera, CameraResultType, Photo } from '@capacitor/camera';
import {
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
} from 'ngx-image-cropper';
import { Observable, Subscription, finalize, interval, map } from 'rxjs';
import { STORAGE_VARIABLES } from 'src/app/core/constants/storage';
import { EOnboardingStep } from 'src/app/core/enums/auth';
import { ISignIn, IVerifyOtp } from 'src/app/core/models/auth';
import { ICategory } from 'src/app/core/models/category';
import { ICity, ICountry, IState } from 'src/app/core/models/location';
import { IUser } from 'src/app/core/models/user';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { CategoryService } from 'src/app/core/services/category/category.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { LocationService } from 'src/app/core/services/location/location.service';
import { MixpanelService } from 'src/app/core/services/mixpanel.service';
import { SupaBaseService } from 'src/app/core/services/supabase.service';
import { UsersService } from 'src/app/core/services/users/users.service';

class AccountPage {
  imageChangedEvent: any = '';
  containWithinAspectRatio = false;
  croppedImage: any = '';
  categories$!: Observable<ICategory[]>;
  selectedCategory!: ICategory;
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  transform: ImageTransform = {};

  segment = 'user_info';
  identity_segment = 'identity';
  liveImageUploaded = false;

  buffer = 0.6;
  progress = 0;

  countries$!: Observable<ICountry[]>;
  states$!: Observable<IState[]>;
  cities$!: Observable<ICity[]>;
  steps: EOnboardingStep = EOnboardingStep.PHONE_VERIFICATION;
  EOnboardingStep = EOnboardingStep;
  imageForm!: FormGroup;
  form!: FormGroup;
  phoneForm!: FormGroup;
  verifyForm!: FormGroup;

  userData!: IUser | null;
  imageUrl: string = '';

  phoneDigitLength = 10;
  phoneDigitErrorText = 'ten (10)';
  phoneDigitSamplePlaceholder = '8095687112';
  getUserSub$!: Subscription;
  uploadImageSub$!: Subscription;
  updateUserSub$!: Subscription;
  resendSub$!: Subscription;

  liveImageUrl = '';

  identity_type = '';

  page = 1;
  size = 100;

  timer = 30;
  intervalSub$!: Subscription;
  verifySub$!: Subscription;

  @ViewChild('') fileId!: HTMLInputElement;
  @ViewChild('') fileCert!: HTMLInputElement;
  @ViewChild('') fileWork!: HTMLInputElement;
  @ViewChild('') fileAddress!: HTMLInputElement;

  constructor(
    private locationService: LocationService,
    private loadService: LoaderService,
    private supaBaseService: SupaBaseService,
    private authService: AuthService,
    private mixpanelService: MixpanelService,
    private alertService: AlertService,
    private usersService: UsersService,
    private fb: FormBuilder,
    private categothryService: CategoryService
  ) {
    this.userData = this.usersService.userProfile;
    if (this.userData && !this.userData.phone_verified) {
      this.steps = EOnboardingStep.PHONE_VERIFICATION;
    } else if (this.userData && !this.userData.profile_image) {
      this.steps = EOnboardingStep.IMAGE_UPLOAD;
    } else if (this.userData && !this.userData.is_onboarded) {
      this.steps = EOnboardingStep.COMPLETE;
    }
  }

  get formCtrl() {
    return this.form.controls;
  }

  get phoneFormCtrl() {
    return this.phoneForm.controls;
  }

  get verifyFormCtrl() {
    return this.verifyForm.controls;
  }

  ngOnInit() {
    console.log(this.userData);
    this.initForm();

    this.countries$ = this.locationService
      .getCountries()
      .pipe(map((res) => res));

    this.categories$ = this.categothryService
      .getCategories({
        page: this.page,
        size: this.size,
      })
      .pipe(
        map((res) => {
          this.selectedCategory = res[0];
          return res;
        })
      );
  }

  initForm() {
    this.imageForm = new FormGroup({
      url: new FormControl(null, [Validators.required]),
    });

    this.phoneForm = new FormGroup({
      code: new FormControl(null, [Validators.required]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(/\d{10}/),
      ]),
    });

    this.verifyForm = new FormGroup({
      code: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(6),
      ]),
    });

    this.form = this.fb.group({
      birthdate: [null, [Validators.required]],
      country: [null, [Validators.required]],
      state: [null, [Validators.required]],
      city: [null, [Validators.required]],
      house_number: [null, [Validators.required]],
      street_name: [null, [Validators.required]],
    });
  }

  async onSubmit(form: any) {
    const loader = await this.loadService.load();
    const { address2, code, house_number, street_name, ...result } = form;
    const payload = {
      ...(this.imageUrl && { profile_image: this.imageUrl }),
      ...result,
      phone: `${form.code}${result.phone}`,
      address: `${form.house_number} ${form.street_name}`,
    };
    console.log(payload);
    await loader.present();
    this.updateUserSub$ = this.usersService
      .updateUser(this.userData?.id, payload)
      .pipe(finalize(async () => await loader.dismiss()))
      .subscribe({
        next: async (res) => {
          this.alertService.success(res);
          // this.modalController.dismiss();
          this.segment = 'identity_info';
        },
        error: async (err) => {
          this.alertService.error(err);
        },
      });
  }

  getUser() {
    this.getUserSub$ = this.usersService
      .getUserById(this.userData?.id)
      .subscribe({
        next: async (user) => {
          localStorage.setItem(STORAGE_VARIABLES.USER, JSON.stringify(user));
        },
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

  deleteImage() {
    this.imageChangedEvent = '';
    this.imageForm.reset();
  }

  uploadImage(event: any) {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.blob;
  }

  imageLoaded() {
    this.showCropper = true;
    console.log('Image loaded');
  }

  cropperReady(sourceDimentions: Dimensions) {
    console.log('Cropper Ready', sourceDimentions);
  }

  loadImageFail() {
    console.log('Load Image Fail');
  }

  async submitImage() {
    this.uploadImageSub$ = this.supaBaseService
      .uploadFile(this.croppedImage, this.userData?.full_name)
      .pipe(
        map((event) => this.getProgress(event, this.croppedImage)),
        finalize(() => (this.steps = EOnboardingStep.COMPLETE))
      )
      .subscribe({
        next: (value) => {
          if (value) this.imageUrl = value;
          this.imageForm.reset();
        },
        error: (err) => {
          this.alertService.error(err);
        },
      });
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 100,
      // allowEditing: true,
      resultType: CameraResultType.Base64,
    });
    var imageUrl = image;
    if (imageUrl.base64String)
      this.supaBaseService
        .uploadVerificationFiles(
          this.dataUrlToFile(
            imageUrl,
            `${this.userData?.first_name} - Live Image`
          ),
          `${this.userData?.first_name} - Live Image`
        )

        .pipe(map((event) => this.getProgress(event, imageUrl)))
        .subscribe({
          next: (value) => {
            this.liveImageUploaded = true;
            this.liveImageUrl = value ?? '';
          },
          error: (err) => {
            this.alertService.error(err);
          },
        });
  }

  dataUrlToFile(dataUrl: Photo, filename?: string) {
    var arr: any;
    var bstr: any;
    var n: any;
    var u8arr: any;

    if (dataUrl.base64String) {
      (arr = dataUrl.base64String.split(',')),
        (bstr = atob(arr[arr.length - 1])),
        (n = bstr.length),
        (u8arr = new Uint8Array(n));
    }

    var mime = '';
    var match = arr[0].match(/:(.*?);/);
    if (match) {
      mime = match[1];
    }

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename ?? '', { type: `image/png` });
  }

  private getProgress(event: HttpEvent<any>, file: any) {
    switch (event.type) {
      case HttpEventType.Sent:
        return `Uploading file "${file.name}" of size ${file.size}.`;
      case HttpEventType.UploadProgress:
        const progress = event.total
          ? Math.round((100 * event.loaded) / event.total)
          : 0;
        this.countProgress(progress);
        return `File "${file.name}" is ${progress}% uploaded.`;
        break;
      case HttpEventType.Response:
        return event.url;
    }
    return null;
  }

  countProgress(progress: number) {
    switch (progress) {
      case 10:
        this.buffer += 0.6;
        this.progress += 10;
        break;
      case 20:
        this.buffer += 0.6;
        this.progress += 10;
        break;
      case 30:
        this.buffer += 0.6;
        this.progress += 10;
        break;
      case 40:
        this.buffer += 0.6;
        this.progress += 10;
        break;
      case 50:
        this.buffer += 0.6;
        this.progress += 10;
        break;
      case 60:
        this.buffer += 0.6;
        this.progress += 10;
        break;
      case 70:
        this.buffer += 0.6;
        this.progress += 10;
        break;
      case 80:
        this.buffer += 0.6;
        this.progress += 10;
        break;
      case 90:
        this.buffer += 0.6;
        this.progress += 10;
        break;
      case 100:
        this.buffer += 0.6;
        this.progress += 10;
        break;
    }
  }

  uploadFile(event: any) {
    const files = event.target.files;
    console.log(files[0]);
    var filesize = (files[0].size / 1024 / 1024).toFixed(4);
    console.log(filesize);
  }

  ngOnDestroy(): void {
    this.getUserSub$?.unsubscribe();
    this.uploadImageSub$?.unsubscribe();
    this.updateUserSub$?.unsubscribe();
  }

  openFile(input: HTMLInputElement) {
    input.click();
  }

  async verifyPhoneNumber(formValue: any) {
    let payload: ISignIn = {
      type: 'phone',
      phone: `${formValue.code}${formValue.phone}`,
    };
    const load = await this.loadService.load();
    await load.present();
    this.authService
      .resendOTPCode(payload)
      .pipe(
        finalize(async () => {
          await load.dismiss();
        })
      )
      .subscribe({
        next: async (res) => {
          await this.alertService.success(res);
          this.steps = EOnboardingStep.VERIFY_PHONE;
          this.startTimer();
        },
        error: async (err) => {
          await this.alertService.error(err);
        },
      });
  }

  async verifyOtp(formPayload: any) {
    const loader = await this.loadService.load();
    await loader.present();
    const payload: IVerifyOtp = {
      type: 'phone',
      code: formPayload['code'],
      phone: `${this.phoneFormCtrl['code'].value}${this.phoneFormCtrl['phone'].value}`,
    };
    this.verifySub$ = this.authService
      .verifyOtp(payload)
      .pipe(
        finalize(async () => {
          await loader.dismiss();
        })
      )
      .subscribe({
        next: (res) => {
          this.alertService.success('Verification successfull');
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

  async resendOTPCode() {
    let payload: ISignIn = {
      type: 'phone',
    };
    const loader = await this.loadService.load();
    await loader.present();
    this.resendSub$ = this.authService
      .resendOTPCode(payload)
      .pipe(
        finalize(async () => {
          await loader.dismiss();
        })
      )
      .subscribe({
        next: async (res) => {
          await this.alertService.success(res);
          if (!this.userData?.profile_image) {
            this.steps = EOnboardingStep.IMAGE_UPLOAD;
          } else if (!this.userData?.is_onboarded) {
            this.steps = EOnboardingStep.COMPLETE;
          }
        },
        error: async (err) => {
          await this.alertService.error(err);
          this.startTimer();
        },
      });
  }
}
