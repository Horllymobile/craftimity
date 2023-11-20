import { AlertController, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/core/models/user';
import { UsersService } from 'src/app/core/services/users/users.service';
import { Router } from '@angular/router';
import { OnboardingCraftsmanComponent } from 'src/app/components/onboarding-craftsman/onboarding-craftsman.component';

@Component({
  selector: 'craftivity-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  userData!: IUser;
  constructor(
    private usersService: UsersService,
    private alertController: AlertController,
    private router: Router,
    private modalController: ModalController
  ) {
    this.userData = this.usersService.userProfile;
  }

  async ngOnInit() {
    const modal = await this.modalController.create({
      component: OnboardingCraftsmanComponent,
      componentProps: {
        user: this.userData,
      },
      animated: true,
      // initialBreakpoint: 0.9,
      // breakpoints: [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      backdropDismiss: true,
      canDismiss: true,
      showBackdrop: true,
    });
    const alert = await this.alertController.create({
      header: 'Incomplete Registration Alert!',
      message: `Finish your sign-up now to unlock all the features designed for craftsmen.
      Complete registration for immediate access to our app's functionalities.`,
      buttons: [
        'CLOSE',
        {
          text: 'Continue',
          handler: async (value) => {
            await alert.dismiss();
            this.router.navigate(['craftivity/pages/more/account']);
          },
        },
      ],
    });

    if (!this.userData?.is_onboarded) {
      await alert.present();
    }
  }

  openCreateStoreModal() {}
}
