import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/core/models/user';
import { UsersService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'craftivity-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage implements OnInit {
  userData!: IUser;
  constructor(private usersService: UsersService) {
    this.userData = this.usersService.userProfile;
  }

  async ngOnInit() {}
}
