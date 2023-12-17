import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { Component, OnInit, WritableSignal } from '@angular/core';
import { IUser } from 'src/app/core/models/user';
import { UsersService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'craftivity-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  userData = this.usersService.getUser();
  constructor(
    private usersService: UsersService,
    private toastController: ToastController,
    private router: Router
  ) {}

  public toastButtons = [
    {
      text: 'Complete',
      role: 'info',
      handler: () => {
        this.router.navigate(['/pages/more/account'], {
          queryParams: { segment: 'identity_info' },
        });
      },
    },
    {
      text: 'Later',
      role: 'cancel',
      handler: async () => {
        await this.toastController.dismiss();
      },
    },
  ];

  async ngOnInit() {
    if (!this.userData?.is_onboarded) {
      this.presentToast('top');
    }
  }

  async presentToast(position: 'top' | 'middle' | 'bottom') {
    const toast = await this.toastController.create({
      message: `Your identity verification is still pending completion.`,
      duration: 5000,
      color: 'warning',
      position: position,
      cssClass: 'toast',
      buttons: this.toastButtons,
    });

    await toast.present();
  }
}
