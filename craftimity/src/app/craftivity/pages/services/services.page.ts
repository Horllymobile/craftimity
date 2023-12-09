import { ServicesService } from './../../../core/services/services/services.service';
import { CreateEditServiceComponent } from './../../../components/create-edit-service/create-edit-service.component';
import { ModalController } from '@ionic/angular';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from 'src/app/core/services/users/users.service';
import { IService } from 'src/app/core/models/service';
import { Subject, finalize, takeUntil } from 'rxjs';

@Component({
  selector: 'craftivity-services',
  templateUrl: './services.page.html',
  styleUrls: ['./services.page.scss'],
})
export class ServicesPage implements OnInit, OnDestroy {
  createEditServiceModal = CreateEditServiceComponent;
  userData = this.usersService.getUser();
  services!: IService[];
  distroy$ = new Subject<void>();
  isGettingServices = false;
  page = 1;
  size = 20;
  constructor(
    private modalController: ModalController,
    private usersService: UsersService,
    private servicesService: ServicesService
  ) {}

  ngOnInit() {
    this.getServices({ page: this.page, size: this.size });
  }

  getServices(params?: { page: number; size: number }) {
    this.isGettingServices = true;
    this.servicesService
      .getServices(params)
      .pipe(
        takeUntil(this.distroy$),
        finalize(() => (this.isGettingServices = false))
      )
      .subscribe({
        next: (value) => {
          this.services = value.data.data;
          console.log(this.services);
        },
      });
  }

  async openModal(modalComponent: any, options?: any) {
    const modal = await this.modalController.create({
      component: modalComponent,
      breakpoints: [0.3, 0.4, 0.5, 0.6, 0.7],
      initialBreakpoint: 0.5,
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
      this.getServices();
    }
  }

  ngOnDestroy(): void {
    this.distroy$.next();
    this.distroy$.complete();
  }
}
