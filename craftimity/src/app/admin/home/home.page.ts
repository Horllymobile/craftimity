import { Component, OnInit } from '@angular/core';
import { ICategory } from 'src/app/core/models/category';
import { IUser } from 'src/app/core/models/user';
import { UsersService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  userData!: IUser;
  categories!: ICategory[];
  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.userData = this.usersService.userProfile;

    this.categories = [
      {
        name: 'Plumber',
        icon: 'assets/svg/plumber.svg',
        active: true,
      },
      {
        name: 'Tilers',
        icon: 'assets/svg/wall.svg',
        active: true,
      },
      {
        name: 'Bricklayers',
        icon: 'assets/svg/hard-hat.svg',
        active: true,
      },
      {
        name: 'Mechanics',
        icon: 'assets/svg/mechanics.svg',
        active: true,
      },
      {
        name: 'Painters',
        icon: 'assets/svg/painter.svg',
        active: true,
      },
      {
        name: 'Carpenters',
        icon: 'assets/svg/carpenter.svg',
        active: true,
      },
      {
        name: 'Health workers',
        icon: 'assets/svg/protection.svg',
        active: true,
      },
      {
        name: 'Electricians',
        icon: 'assets/svg/electrician.svg',
        active: true,
      },
      {
        name: 'Rewires',
        icon: 'assets/svg/wire.svg',
        active: true,
      },
      {
        name: 'AC technicians',
        icon: 'assets/svg/appliance-repair.svg',
        active: true,
      },
      {
        name: 'Computer technicians',
        icon: 'assets/svg/technician.svg',
        active: true,
      },
    ];
  }
}
