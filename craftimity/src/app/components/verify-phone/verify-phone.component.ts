import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/core/shared/shared.module';

@Component({
  selector: 'app-verify-phone',
  templateUrl: './verify-phone.component.html',
  styleUrls: ['./verify-phone.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, SharedModule, ReactiveFormsModule],
})
export class VerifyPhoneComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
