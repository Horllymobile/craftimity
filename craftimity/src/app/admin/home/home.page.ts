import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ICategory } from 'src/app/core/models/category';
import { IUser } from 'src/app/core/models/user';
import { CategoryService } from 'src/app/core/services/category/category.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import Swiper from 'swiper';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userData!: IUser;
  categories$!: Observable<ICategory[]>;
  page = 1;
  size = 20;
  swiper = new Swiper('.swiper-container', {
    slidesPerView: 5,
    spaceBetween: 5,
    grid: {
      rows: 3,
    },
    mousewheel: {
      forceToAxis: true,
    },
  });
  constructor(
    private usersService: UsersService,
    private categothryService: CategoryService
  ) {}

  ngOnInit() {
    this.userData = this.usersService.userProfile;

    this.categories$ = this.categothryService.getCategories({
      page: this.page,
      size: this.size,
    });
  }
}
