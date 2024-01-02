import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { CategorySliderComponent } from 'src/app/components/category-slider/category-slider.component';

@NgModule({
  declarations: [HomePage],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    IonicModule,
    HomePageRoutingModule,
    CategorySliderComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePageModule {}
