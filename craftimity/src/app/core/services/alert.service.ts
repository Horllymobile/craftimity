import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private alertCtrl: AlertController, private router: Router) {}

  async success(message: string, route?: string) {
    const alert = await this.alertCtrl.create({
      message,
      animated: true,
      buttons: [
        {
          text: 'OKAY',
          ...(route && {
            handler: (value) => {
              this.router.navigateByUrl(route);
            },
          }),
        },
      ],
    });
    return await alert.present();
  }

  async error(message: string) {
    const alert = await this.alertCtrl.create({
      message,
      animated: true,
      buttons: ['Close'],
    });
    return await alert.present();
  }
}
