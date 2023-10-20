import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import {
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
} from 'ngx-image-cropper';
import { Observable, finalize, map } from 'rxjs';
import { EOnboardingStep } from 'src/app/core/enums/auth';
import { IUpdateUser } from 'src/app/core/models/auth';
import { ICity, ICountry, IState } from 'src/app/core/models/location';
import { IUser } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { LocationService } from 'src/app/core/services/location/location.service';
import { SupaBaseService } from 'src/app/core/services/supabase.service';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent implements OnInit {
  imageChangedEvent: any = '';
  containWithinAspectRatio = false;
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  transform: ImageTransform = {};

  steps: EOnboardingStep = EOnboardingStep.IMAGE_UPLOAD;
  EOnboardingStep = EOnboardingStep;

  userData!: IUser;
  imageForm!: FormGroup;
  form!: FormGroup;

  showPassword = false;

  countries$!: Observable<ICountry[]>;
  states$!: Observable<IState[]>;
  cities$!: Observable<ICity[]>;

  constructor(
    private supabaseService: SupaBaseService,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private fb: FormBuilder,
    private locationService: LocationService,
    private route: Router,
    private alertService: AlertService,
    private alertCtrl: AlertController
  ) {
    this.userData = JSON.parse(localStorage.getItem('USER') || '') as IUser;
  }

  get formData() {
    return this.form.value;
  }

  get formControl() {
    return this.form.controls;
  }

  ngOnInit() {
    this.initForm();
    this.countries$ = this.locationService
      .getCountries()
      .pipe(map((res) => res));
  }

  initForm() {
    // this.phoneForm = this.fb.group({
    //   code: [null, [Validators.required]],
    //   phone: [
    //     null,
    //     [
    //       Validators.required,
    //       Validators.minLength(10),
    //       Validators.maxLength(10),
    //     ],
    //   ],
    // });
    // this.emailForm = this.fb.group({
    //   email: [null, [Validators.required, Validators.email]],
    // });
    // this.otpForm = this.fb.group({
    //   code: [null, [Validators.required]],
    // });
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

  isFormValid(form: FormGroup) {
    return form.valid && form.value.accept === true;
  }

  onShowPassword() {
    this.showPassword = !this.showPassword;
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
    // this.imageForm.reset();
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
    const loader = await this.loadingCtrl.create({
      message: '',
      animated: true,
      duration: 5000,
      spinner: 'lines-small',
      cssClass: 'loader',
    });

    await loader.present();
    const url = await this.supabaseService.uploadFile(this.croppedImage);
    if (url) {
      this.updateImage(url, loader);
    }
  }

  async updateImage(url: string, loader: HTMLIonLoadingElement) {
    this.authService
      .updateImageUrl(this.userData?.id, {
        profile_image: url,
      })
      .pipe(
        finalize(async () => {
          await this.loadingCtrl.dismiss();
        })
      )
      .subscribe({
        next: async (res) => {
          const alert = await this.alertCtrl.create({
            header: 'Success',
            message: 'Image uploaded successfully',
            animated: true,
            buttons: ['Okay'],
          });
          await alert.present().then((val) => {
            this.steps = EOnboardingStep.COMPLETE;
          });
        },
        error: async (err) => {
          const alert = await this.alertCtrl.create({
            header: 'Error',
            message: err.error.message,
            animated: true,
            buttons: ['Okay'],
          });
          await this.loadingCtrl.dismiss();
          await alert.present();
        },
      });
  }

  async updateUser(formData: { [key: string]: string }) {
    const loader = await this.loadingCtrl.create({
      message: '',
      animated: true,
      duration: 5000,
      spinner: 'lines-small',
      cssClass: 'loader',
    });
    const payload: IUpdateUser = {
      first_name: formData['firstName'],
      last_name: formData['lastName'],
      birthdate: formData['birthdate'],
      password: formData['password'],
      address: formData['address'],
      country: Number(formData['country']),
      state: Number(formData['state']),
      city: Number(formData['city']),
    };
    await loader.present();
    this.authService
      .updateUser(this.userData.id, payload)
      .pipe(
        finalize(async () => {
          await this.loadingCtrl.dismiss();
        })
      )
      .subscribe({
        next: (res) => {
          this.form.reset();
          this.alertService.success(res).then(() => {
            this.route.navigateByUrl('/auth/login');
          });
        },
        error: async (err) => {
          await this.alertService.success(err.message);
        },
      });
  }
}
