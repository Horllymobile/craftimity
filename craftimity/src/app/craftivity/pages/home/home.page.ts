import { ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/core/models/user';
import { UsersService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  userData!: IUser;
  constructor(
    private usersService: UsersService,
    private modalController: ModalController
  ) {}

  ngOnInit(): void {
    this.userData = this.usersService.userProfile;
  }

  openCreateStoreModal() {}
}
