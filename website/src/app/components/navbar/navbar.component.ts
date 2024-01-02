import { CUSTOM_ELEMENTS_SCHEMA, Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../header/header.component';
import { SwiperOptions } from 'swiper/types';
import { SwiperDirective } from '../../core/directives/swiper.directive';
import { SwiperContainer } from 'swiper/element';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, HeaderComponent, SwiperDirective],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class NavbarComponent {
  @ViewChild('swipper') swiper!: SwiperContainer;
  index = 0;
  config: SwiperOptions = {
    slidesPerView: 1,
    navigation: true,
    autoplay: true,
    pagination: true,
    loop: true,
    allowSlideNext: true,
    allowSlidePrev: true,
    allowTouchMove: true,
    speed: 500,
  };
  constructor() {}

  slideChange(ev: any) {}

  changeSlide() {
    // this.swiper.slideNext();
  }
}
