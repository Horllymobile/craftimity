import { LoaderService } from 'src/app/core/services/loader.service';
import { ServicesService } from './../../core/services/services/services.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController, NavParams } from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subject, finalize, takeUntil } from 'rxjs';
import { IUser } from 'src/app/core/models/user';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/core/shared/shared.module';

@Component({
  selector: 'app-create-edit-service',
  templateUrl: './create-edit-service.component.html',
  standalone: true,
  imports: [CommonModule, IonicModule, SharedModule, ReactiveFormsModule],
  styleUrls: ['./create-edit-service.component.scss'],
})
export class CreateEditServiceComponent implements OnInit {
  isEditing = false;
  data: any;
  serviceForm!: FormGroup;
  distroy$ = new Subject<void>();
  constructor(
    private modalController: ModalController,
    private alertService: AlertService,
    private navParams: NavParams,
    private fb: FormBuilder,
    private servicesService: ServicesService,
    private loaderService: LoaderService
  ) {
    this.data = navParams.data;
  }

  ngOnInit() {
    this.initForm(this.data.service);
  }

  initForm(service?: any) {
    this.serviceForm = this.fb.group({
      name: [service?.name, []],
      price: [service?.price, Validators.required],
      description: [service?.description],
      negotiable: [service?.negotiable],
    });

    this.serviceForm.valueChanges.pipe(takeUntil(this.distroy$)).subscribe({
      next: () => {
        this.isEditing = true;
      },
    });
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

  async onSubmit(formPayload: any) {
    const loader = await this.loaderService.load();
    await loader.present();

    if (this.data.action === 'create') {
      this.create(formPayload, loader);
    } else {
      this.update(formPayload, loader);
    }
  }

  create(payload: any, loader: any) {
    this.servicesService
      .create(payload)
      .pipe(
        takeUntil(this.distroy$),
        finalize(async () => await loader.dismiss())
      )
      .subscribe({
        next: (value) => {
          this.modalController.dismiss(value, 'success');
        },
        error: (err) => {
          this.alertService.error(err);
        },
      });
  }

  update(payload: any, loader: any) {
    this.servicesService
      .update(this.data.service.id, payload)
      .pipe(
        takeUntil(this.distroy$),
        finalize(async () => await loader.dismiss())
      )
      .subscribe({
        next: (value) => {
          this.modalController.dismiss(value, 'success');
        },
        error: (err) => {
          this.alertService.error(err);
        },
      });
  }

  ngOnDestroy(): void {
    this.distroy$.next();
    this.distroy$.complete();
  }
}
