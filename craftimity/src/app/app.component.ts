import { Component, OnInit } from '@angular/core';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { AlertController } from '@ionic/angular';
import { isPlatform, Platform } from '@ionic/angular';
import {
  NativeSettings,
  AndroidSettings,
  IOSSettings,
} from 'capacitor-native-settings';
import { getPlaform } from './core/utils/functions';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private alertCtrl: AlertController,
    private platform: Platform,
    private analytics: AngularFireAnalytics
  ) {}

  async ngOnInit() {
    this.platform.ready().then(() => {
      this.analytics.logEvent('app_lunch', {
        app: 'Client',
        platform: getPlaform(),
      });
    });
    const alert = await this.alertCtrl.create({
      header: 'Network Status',
      message: 'Seems your internet connection is down!',
      buttons: [
        'Close',
        {
          text: 'Settings',
          handler: (value) => {
            if (isPlatform('android')) {
              NativeSettings.openAndroid({
                option: AndroidSettings.ApplicationDetails,
              });
            } else if (isPlatform('iphone')) {
              NativeSettings.openIOS({
                option: IOSSettings.App,
              });
            }
          },
        },
      ],
      animated: true,
    });
    if (navigator && !navigator.onLine) {
      await alert.present();
    }
  }
}
