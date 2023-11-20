import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingCraftsmanComponent } from './onboarding-craftsman/onboarding-craftsman.component';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../core/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [OnboardingCraftsmanComponent],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  exports: [OnboardingCraftsmanComponent],
})
export class ComponentsModule {}
