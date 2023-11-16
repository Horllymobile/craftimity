import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-onboarding-craftsman',
  templateUrl: './onboarding-craftsman.component.html',
  styleUrls: ['./onboarding-craftsman.component.scss'],
})
export class OnboardingCraftsmanComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async close(data?: any) {
    if (data) {
      await this.modalController.dismiss(data, 'success');
    } else {
      await this.modalController.dismiss(null, 'cancle');
    }
  }
}
