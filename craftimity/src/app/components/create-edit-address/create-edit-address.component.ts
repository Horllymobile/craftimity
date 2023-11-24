import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController, NavParams } from '@ionic/angular';
import { Observable, Subject, finalize, map, takeUntil } from 'rxjs';
import { ICountry, IState, ICity } from 'src/app/core/models/location';
import { IAddress, IUser } from 'src/app/core/models/user';
import { AlertService } from 'src/app/core/services/alert.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { LocationService } from 'src/app/core/services/location/location.service';
import { UsersService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'app-create-edit-address',
  templateUrl: './create-edit-address.component.html',
  styleUrls: ['./create-edit-address.component.scss'],
})
export class CreateEditAddressComponent implements OnInit {
  countries$!: Observable<ICountry[]>;
  states$!: Observable<IState[]>;
  cities$!: Observable<ICity[]>;

  locationForm!: FormGroup;

  userData!: IUser | null;

  distroy$ = new Subject<void>();

  data: any;
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService,
    private locationService: LocationService,
    private alertService: AlertService,
    private loaderService: LoaderService,
    private modalController: ModalController,
    private navParams: NavParams
  ) {
    this.data = navParams.data;
  }

  ngOnInit() {
    this.userData = this.usersService.getUser();
    this.countries$ = this.locationService
      .getCountries()
      .pipe(map((res) => res));

    if (this.data.action === 'edit') {
      this.initForm(this.data.address);
      this.getLocations();
    } else {
      this.initForm();
    }
  }

  getLocations() {
    this.countries$ = this.locationService
      .getCountries()
      .pipe(map((res) => res));

    this.states$ = this.locationService.getStates().pipe(map((res) => res));

    this.cities$ = this.locationService.getCities().pipe(map((res) => res));
  }

  initForm(address?: IAddress) {
    this.locationForm = this.fb.group({
      floor: [address?.floor, []],
      house: [address?.house, Validators.required],
      street: [address?.street, Validators.required],
      country: [address?.Country?.id, Validators.required],
      state: [address?.State?.id, Validators.required],
      city: [address?.City?.id, Validators.required],
    });

    this.locationForm.valueChanges.pipe(takeUntil(this.distroy$)).subscribe({
      next: () => {
        this.isEditing = true;
      },
    });
  }

  onSubmit(form: any) {
    if (this.data.action === 'add') {
      this.onSubmitCreateLocationInfo(form);
    } else {
      this.onSubmitUpdateLocationInfo(form);
    }
  }

  async onSubmitCreateLocationInfo(form: any) {
    const loader = await this.loaderService.load();
    await loader.present();
    this.usersService
      .createUserAddress(this.userData?.id, form)
      .pipe(
        takeUntil(this.distroy$),
        finalize(async () => await loader.dismiss())
      )
      .subscribe({
        next: async (res) => {
          this.isEditing = false;
          await this.closeModal('success', res);
        },
        error: (error) => {
          this.alertService.error(error);
        },
      });
  }

  async onSubmitUpdateLocationInfo(form: any) {
    // console.log(this.data.address);
    const loader = await this.loaderService.load();
    await loader.present();
    form = {
      user_id: this.userData?.id,
      ...form,
    };
    this.usersService
      .updateUserAddress(this.data.address.id, form)
      .pipe(
        takeUntil(this.distroy$),
        finalize(async () => await loader.dismiss())
      )
      .subscribe({
        next: async (res) => {
          this.isEditing = false;
          await this.closeModal('success', res);
        },
        error: (error) => {
          this.alertService.error(error);
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

  async closeModal(role: string, data?: any) {
    if (!this.isEditing) {
      await this.modalController.dismiss(data, role);
    } else {
      this.alertService.success(
        'Are you sure you want to quit editing?',
        undefined,
        [
          {
            text: 'Yes',
            handler: async (value) => {
              await this.modalController.dismiss(data, role);
            },
          },
          {
            text: 'No',
          },
        ]
      );
    }
  }

  ngOnDestroy(): void {
    this.distroy$.next();
    this.distroy$.complete();
  }
}
