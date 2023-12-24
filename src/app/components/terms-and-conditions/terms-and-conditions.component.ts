import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss'],
})
export class TermsAndConditionsComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async close() {
    await this.modalController.dismiss();
  }
}
