import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ICategory } from 'src/app/core/models/category';
import { IUser } from 'src/app/core/models/user';
import { CategoryService } from 'src/app/core/services/category/category.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { SwiperOptions } from 'swiper/types';
import { Navigation } from 'swiper/modules';

@Component({
  selector: 'craftimity-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userData!: IUser;
  categories$!: Observable<ICategory[]>;
  selectedCategory!: ICategory;
  page = 1;
  size = 20;
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
    private usersService: UsersService,
    private categothryService: CategoryService
  ) {}

  ngOnInit() {
    this.userData = this.usersService.userProfile;

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

  selectCategory(category: ICategory) {
    this.selectedCategory = category;
  }
}
