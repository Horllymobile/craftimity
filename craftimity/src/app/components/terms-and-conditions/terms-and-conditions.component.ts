import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { SharedModule } from 'src/app/core/shared/shared.module';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, SharedModule, ReactiveFormsModule],
})
export class TermsAndConditionsComponent implements OnInit {
  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async close() {
    await this.modalController.dismiss();
  }
}
