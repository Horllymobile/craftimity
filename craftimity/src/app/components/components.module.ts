import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingCraftsmanComponent } from './onboarding-craftsman/onboarding-craftsman.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [OnboardingCraftsmanComponent],
  imports: [CommonModule, IonicModule],
  exports: [OnboardingCraftsmanComponent],
})
export class ComponentsModule {}
