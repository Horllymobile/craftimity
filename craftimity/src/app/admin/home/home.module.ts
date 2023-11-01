import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { SwipperDirective } from 'src/app/core/directives/fm-swipper.directive';

@NgModule({
  declarations: [HomePage, SwipperDirective],
  imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePageModule {}
