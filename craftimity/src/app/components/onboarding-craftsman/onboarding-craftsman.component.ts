import { UsersService } from './../../core/services/users/users.service';
import { AlertService } from './../../core/services/alert.service';
import { MixpanelService } from './../../core/services/mixpanel.service';
import { SupaBaseService } from './../../core/services/supabase.service';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import {
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
} from 'ngx-image-cropper';
import { Observable, Subscription, finalize, map } from 'rxjs';
import { EOnboardingStep } from 'src/app/core/enums/auth';
import { ICity, ICountry, IState } from 'src/app/core/models/location';
import { LoaderService } from 'src/app/core/services/loader.service';
import { LocationService } from 'src/app/core/services/location/location.service';
import { IUser } from 'src/app/core/models/user';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { STORAGE_VARIABLES } from 'src/app/core/constants/storage';
import { Camera, CameraResultType } from '@capacitor/camera';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/core/shared/shared.module';

@Component({
  selector: 'app-onboarding-craftsman',
  templateUrl: './onboarding-craftsman.component.html',
  styleUrls: ['./onboarding-craftsman.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class OnboardingCraftsmanComponent implements OnInit, OnDestroy {
  imageChangedEvent: any = '';
  containWithinAspectRatio = false;
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  transform: ImageTransform = {};

  segment = 'user_info';

  countries$!: Observable<ICountry[]>;
  states$!: Observable<IState[]>;
  cities$!: Observable<ICity[]>;
  steps: EOnboardingStep = EOnboardingStep.IMAGE_UPLOAD;
  EOnboardingStep = EOnboardingStep;
  imageForm!: FormGroup;
  form!: FormGroup;
  progress = 0;
  buffer = 0;

  @Input() userData!: IUser;
  imageUrl: string = '';

  phoneDigitLength = 10;
  phoneDigitErrorText = 'ten (10)';
  phoneDigitSamplePlaceholder = '8095687112';
  getUserSub$!: Subscription;
  uploadImageSub$!: Subscription;
  updateUserSub$!: Subscription;
  liveImageUploaded = false;
  constructor(
    private modalController: ModalController,
    private locationService: LocationService,
    private loadService: LoaderService,
    private supaBaseService: SupaBaseService,
    private mixpanelService: MixpanelService,
    private alertService: AlertService,
    private usersService: UsersService,
    private fb: FormBuilder,
    private navParam: NavParams
  ) {
    this.userData = this.navParam.get('user');
  }

  get formCtrl() {
    return this.form.controls;
  }

  ngOnInit() {
    console.log(this.userData);
    this.initForm();

    this.countries$ = this.locationService
      .getCountries()
      .pipe(map((res) => res));
  }

  initForm() {
    this.imageForm = new FormGroup({
      url: new FormControl(null, [Validators.required]),
    });

    this.form = this.fb.group({
      code: [null, [Validators.required]],
      phone: [null, [Validators.required, Validators.pattern(/\d{10}/)]],
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
      .updateUser(this.userData.id, payload)
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

  async close(data?: any) {
    if (data) {
      await this.modalController.dismiss(data, 'success');
    } else {
      await this.modalController.dismiss(null, 'cancle');
    }
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

  private getProgress(event: HttpEvent<any>, file: File) {
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

  ngOnDestroy(): void {
    this.getUserSub$?.unsubscribe();
    this.uploadImageSub$?.unsubscribe();
    this.updateUserSub$?.unsubscribe();
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Uri,
    });

    // image.webPath will contain a path that can be set as an image src.
    // You can access the original file using image.path, which can be
    // passed to the Filesystem API to read the raw data of the image,
    // if desired (or pass resultType: CameraResultType.Base64 to getPhoto)
    var imageUrl = image.base64String;

    // Can be set to the src of an image now
    // imageElement.src = imageUrl;
    this.supaBaseService
      .uploadFile(image.base64String)
      .pipe(
        map((event) => this.getProgress(event, this.croppedImage)),
        finalize(() => (this.steps = EOnboardingStep.COMPLETE))
      )
      .subscribe({
        next: (value) => {},
        error: (err) => {
          this.alertService.error(err);
        },
      });
  }
}
