import { ModalController, AlertController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { OnboardingCraftsmanComponent } from 'src/app/components/onboarding-craftsman/onboarding-craftsman.component';
import { IUser } from 'src/app/core/models/user';
import { UsersService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'craftivity-pages',
  templateUrl: './pages.page.html',
  styleUrls: ['./pages.page.scss'],
})
export class PagesPage implements OnInit {
  userData!: IUser;
  constructor(
    private modalController: ModalController,
    private usersService: UsersService,
    private alertController: AlertController
  ) {
    this.userData = this.usersService.userProfile;
  }

  async ngOnInit() {
    const modal = await this.modalController.create({
      component: OnboardingCraftsmanComponent,
      animated: true,
      initialBreakpoint: 0.9,
      breakpoints: [0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
      backdropDismiss: true,
      canDismiss: true,
      showBackdrop: true,
      componentProps: {
        user: this.userData,
      },
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
            await modal.present();
          },
        },
      ],
    });

    if (!this.userData.is_onboarded) {
      await alert.present();
    }
  }
}