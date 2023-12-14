import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnboardingCraftsmanComponent } from './onboarding-craftsman/onboarding-craftsman.component';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../core/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CreateEditAddressComponent } from './create-edit-address/create-edit-address.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CreateEditServiceComponent } from './create-edit-service/create-edit-service.component';

@NgModule({
  declarations: [
    OnboardingCraftsmanComponent,
    CreateEditAddressComponent,
    TermsAndConditionsComponent,
    PrivacyPolicyComponent,
    CreateEditServiceComponent,
  ],
  imports: [CommonModule, IonicModule, SharedModule, ReactiveFormsModule],
  exports: [
    // OnboardingCraftsmanComponent,
    // CreateEditAddressComponent,
    // TermsAndConditionsComponent,
    // PrivacyPolicyComponent,
    // CreateEditServiceComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule {}
