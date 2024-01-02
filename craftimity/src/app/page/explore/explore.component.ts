import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {
  Observable,
  Subject,
  debounce,
  debounceTime,
  distinctUntilChanged,
  distinctUntilKeyChanged,
  finalize,
  map,
  take,
  takeUntil,
} from 'rxjs';
import { ICategory } from 'src/app/core/models/category';
import { IService } from 'src/app/core/models/service';
import { CategoryService } from 'src/app/core/services/category/category.service';
import { ServicesService } from 'src/app/core/services/services/services.service';
import { Navigation } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';

@Component({
  selector: 'craftimity-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.scss'],
})
export class ExploreComponent implements OnInit {
  services!: IService[];
  distroy$ = new Subject<void>();
  isGettingServices = false;
  page = 1;
  size = 20;
  categories$!: Observable<ICategory[]>;

  segment = '';

  selectedCategory!: ICategory;

  search = new FormControl();

  config: SwiperOptions = {
    modules: [
      Navigation,
      // Pagination, A11y, Mousewheel, Controller
    ],
    // autoHeight: true,
    slidesPerView: 5,
    spaceBetween: 20,
    navigation: false,
    allowSlideNext: true,
    allowSlidePrev: true,
    // pagination: {
    //   clickable: true,
    //   dynamicBullets: true,
    // },
    // centeredSlides: true,
    // breakpoints: {
    //   400: {
    //     slidesPerView: 'auto',
    //     centeredSlides: false,
    //   },
    // },
  };

  constructor(
    private modalController: ModalController,
    private categothryService: CategoryService,
    private servicesService: ServicesService
  ) {}

  selectCategory(category: ICategory) {
    if (!category) {
      this.getServices();
    } else {
      this.selectedCategory = category;
      if (this.search.value) {
        this.getServices({ category: category.id, name: this.search.value });
      } else {
        this.getServices({ category: category.id });
      }
    }
  }

  ngOnInit() {
    this.getCategory();
    this.getServices({ page: this.page, size: this.size });

    this.search.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        map((value: string) => value.trim()),
        takeUntil(this.distroy$)
      )
      .subscribe({
        next: (value) => {
          if (value) {
            this.getServices({ name: value });
          }
        },
      });
  }

  getCategory(params?: { page?: number; size?: number }) {
    this.categories$ = this.categothryService.getCategories(params).pipe(
      map((res) => {
        // this.selectedCategory = res[0];
        return res;
      })
    );
  }

  getServices(params?: {
    page?: number;
    size?: number;
    category?: number;
    name?: string;
  }) {
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
