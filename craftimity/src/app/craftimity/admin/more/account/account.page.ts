import { VerifyComponent } from './../../../../craftivity/auth/verify/verify.component';
import { SupaBaseService } from 'src/app/core/services/supabase.service';
import { AlertService } from './../../../../core/services/alert.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
} from 'ngx-image-cropper';
import { Observable, Subject, finalize, find, map, takeUntil } from 'rxjs';
import { STORAGE_VARIABLES } from 'src/app/core/constants/storage';
import { ICountry, IState, ICity } from 'src/app/core/models/location';
import { IUser } from 'src/app/core/models/user';
import { LoaderService } from 'src/app/core/services/loader.service';
import { LocationService } from 'src/app/core/services/location/location.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { IonInput, ModalController } from '@ionic/angular';
import { CreateEditAddressComponent } from 'src/app/components/create-edit-address/create-edit-address.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
})
export class AccountPage implements OnInit, OnDestroy {
  imageChangedEvent: any = '';
  containWithinAspectRatio = false;
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  transform: ImageTransform = {};

  segment = 'user_info';
  userData = this.usersService.userData;
  edit = false;
  editImage = false;
  editLocation = false;
  countries$!: Observable<ICountry[]>;
  states$!: Observable<IState[]>;
  cities$!: Observable<ICity[]>;

  phoneDigitLength = 10;
  phoneDigitErrorText = 'ten (10)';
  phoneDigitSamplePlaceholder = '8095687112';
  countryCode = '';

  form!: FormGroup;
  imageForm!: FormGroup;

  isEditing = false;
  isEditingImage = false;
  isEdittingLocation = false;

  distroy$ = new Subject<void>();

  @ViewChild('imageFile') imageFile!: HTMLInputElement;

  createEditAddressComponent = CreateEditAddressComponent;
  verifyComponent = VerifyComponent;
  constructor(
    private usersService: UsersService,
    private locationService: LocationService,
    private fb: FormBuilder,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private supaBaseService: SupaBaseService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.countries$ = this.locationService
      .getCountries()
      .pipe(map((res) => res));
  }

  initForm(user?: IUser | null) {
    this.imageForm = new FormGroup({
      url: new FormControl(null, [Validators.required]),
    });

    this.form = this.fb.group({
      first_name: [user?.first_name],
      last_name: [user?.last_name],
      birthdate: [user?.birthdate],
    });

    if (!user?.email) {
      this.form.addControl('email', new FormControl(user?.email));
    }
    if (!user?.phone_number) {
      this.form.addControl(
        'phone',
        this.fb.group({
          code: [this.getCodeFromPhone(user?.phone_number)],
          number: [user?.phone_number, [Validators.pattern(/^\d{10}$/)]],
        }) as AbstractControl
      );
    }

    this.form.valueChanges.pipe(takeUntil(this.distroy$)).subscribe({
      next: () => {
        this.isEditing = true;
      },
    });

    this.imageForm.valueChanges.pipe(takeUntil(this.distroy$)).subscribe({
      next: () => {
        this.isEditingImage = true;
      },
    });
  }

  getCodeFromPhone(phone?: string) {
    return phone?.slice(0, 3) ?? null;
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

  getCountryById(id: number) {
    return this.countries$.pipe(
      map((countries) => countries.find((country) => country.id === id))
    );
  }

  async openImage(input: IonInput) {
    (await input.getInputElement()).click();
  }

  getUser() {
    this.usersService
      .getUserById(this.userData()?.id)
      .pipe(takeUntil(this.distroy$))
      .subscribe({
        next: async (res) => {
          localStorage.setItem(STORAGE_VARIABLES.USER, JSON.stringify(res));
          this.userData.set(res);
        },
        error: (error) => {},
      });
  }

  async onSubmitUserInfo(form: any) {
    this.isEditing = false;
    const payload = {
      ...form,
      ...(form?.phone?.code && {
        phone: `${form.phone.code}${form.phone.number}`,
      }),
    };
    const loader = await this.loaderService.load();
    await loader.present();
    this.usersService
      .updateUser(this.userData()?.id, payload)
      .pipe(
        takeUntil(this.distroy$),
        finalize(async () => await loader.dismiss())
      )
      .subscribe({
        next: async () => {
          this.getUser();
          await this.toogleEdit();
        },
        error: (error) => {
          this.alertService.error(error);
        },
      });
  }

  async toogleEdit() {
    if (this.isEditing) {
      await this.alertService.success(
        'Are you sure you want to quit editting?',
        undefined,
        [
          {
            text: 'Yes',
            handler: (value) => {
              this.edit = !this.edit;
              if (this.edit) this.initForm(this.userData());
            },
          },
          {
            text: 'No',
          },
        ]
      );
    } else {
      this.edit = !this.edit;
      if (this.edit) this.initForm(this.userData());
    }
  }

  async toogleEditImage() {
    if (this.isEditingImage) {
      await this.alertService.success(
        'Are you sure you want to quit editting?',
        undefined,
        [
          {
            text: 'Yes',
            handler: (value) => {
              this.editImage = !this.editImage;
              if (this.editImage) this.initForm(this.userData());
            },
          },
          {
            text: 'No',
          },
        ]
      );
    } else {
      this.editImage = !this.editImage;
      if (this.editImage) this.initForm(this.userData());
    }
  }

  async openModal(modalComponent: any, options?: any) {
    const modal = await this.modalController.create({
      component: modalComponent,
      breakpoints: [0.3, 0.4, 0.5, 0.6, 0.7],
      initialBreakpoint: 0.7,
      backdropDismiss: true,
      animated: true,
      canDismiss: true,
      showBackdrop: true,
      componentProps: {
        ...options,
      },
    });

    await modal.present();

    const dismis = await modal.onDidDismiss();
    if (dismis.role === 'success') {
      this.getUser();
    }
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
    // this.submitImage();
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
    const load = await this.loaderService.load();
    await load.present();
    this.supaBaseService
      .uploadFile(this.croppedImage, this.userData()?.full_name)
      .pipe(
        takeUntil(this.distroy$),
        map((event) => this.getProgress(event, this.croppedImage))
      )
      .subscribe({
        next: (value) => {
          this.imageForm.reset();
          if (value !== null) {
            this.usersService
              .updateUser(this.userData()?.id, { profile_image: value })
              .pipe(takeUntil(this.distroy$))
              .subscribe({
                next: async (value) => {
                  this.getUser();
                  this.isEditingImage = false;
                  await this.toogleEditImage();
                  await load.dismiss();
                },
              });
          }
        },
        error: (err) => {
          this.alertService.error(err);
        },
      });
  }

  private getProgress(event: HttpEvent<any>, file: any) {
    switch (event.type) {
      case HttpEventType.Sent:
        return null;
      case HttpEventType.UploadProgress:
        const progress = event.total
          ? Math.round((100 * event.loaded) / event.total)
          : 0;
        // this.countProgress(progress);
        return null;
        break;
      case HttpEventType.Response:
        const str = `https://lxscyztmkcklnybwpymh.supabase.co/storage/v1/object/public/Images/profiles/`;
        const urls = event.url?.split('/');
        if (urls) return `${str}${urls[urls.length - 1]}`;
        break;
    }
    return null;
  }

  ngOnDestroy(): void {
    this.distroy$.next();
    this.distroy$.complete();
  }
}
