import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule, Routes } from "@angular/router";
import { ComponentsModule } from "../components/components.module";
import { MaterialModule } from "../core/shared/material.module";
import { SharedModule } from "../core/shared/shared.module";
import { LoginPageComponent } from "./login-page/login-page.component";
import { ReactiveFormsModule } from "@angular/forms";
import { PhoneVerificationComponent } from "./phone-verification/phone-verification.component";
import { EmailVerificationComponent } from "./email-verification/email-verification.component";
import { ToastrService } from "ngx-toastr";
import { OnboardingComponent } from "./onboarding/onboarding.component";
import { RegisterComponent } from "./register/register.component";

const routes: Routes = [
  {
    path: "onboarding",
    component: OnboardingComponent,
  },
  {
    path: "verify-phone/:phone",
    component: PhoneVerificationComponent,
  },
  {
    path: "verify-email/:email",
    component: EmailVerificationComponent,
  },
  {
    path: "login",
    component: LoginPageComponent,
  },
  {
    path: "register",
    component: RegisterComponent,
  },
  {
    path: "",
    redirectTo: "login",
    pathMatch: "full",
  },
];

@NgModule({
  declarations: [
    LoginPageComponent,
    PhoneVerificationComponent,
    EmailVerificationComponent,
    OnboardingComponent,
    RegisterComponent,
  ],
  imports: [
    CommonModule,
    ComponentsModule,
    RouterModule.forChild(routes),
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
  ],
  providers: [ToastrService],
})
export class AuthModule {}
