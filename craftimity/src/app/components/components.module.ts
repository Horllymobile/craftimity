import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingCraftsmanComponent } from './onboarding-craftsman/onboarding-craftsman.component';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../core/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateEditAddressComponent } from './create-edit-address/create-edit-address.component';

@NgModule({
  declarations: [OnboardingCraftsmanComponent, CreateEditAddressComponent],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [OnboardingCraftsmanComponent, CreateEditAddressComponent],
})
export class ComponentsModule {}
