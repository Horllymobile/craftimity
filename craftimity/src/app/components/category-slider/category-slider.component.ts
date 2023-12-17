import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ICategory } from 'src/app/core/models/category';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { Navigation } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';

@Component({
  selector: 'app-category-slider',
  templateUrl: './category-slider.component.html',
  styleUrls: ['./category-slider.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, SharedModule, ReactiveFormsModule],
})
export class CategorySliderComponent implements OnInit {
  @Input() categories!: ICategory[];
  selectedCategory!: ICategory | null;
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
  @Output() selectCategory = new EventEmitter<ICategory>();
  constructor() {}

  ngOnInit() {}

  getCategory(category: ICategory) {
    this.selectedCategory = category;
    this.selectCategory.emit(category);
  }
}
