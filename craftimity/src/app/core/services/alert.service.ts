import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private alertCtrl: AlertController) {}

  async success(message: string) {
    const alert = await this.alertCtrl.create({
      message,
      animated: true,
      buttons: ['OKAY'],
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
