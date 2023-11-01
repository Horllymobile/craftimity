import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { VerifyComponent } from './verify/verify.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { SessionGuard } from 'src/app/core/guards/session/session.guard';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [SessionGuard],
  },
  {
    path: 'verify/:data',
    component: VerifyComponent,
    canActivate: [SessionGuard],
  },
  {
    path: 'onboarding',
    component: OnboardingComponent,
    canActivate: [SessionGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [SessionGuard],
  },
];

@NgModule({
  declarations: [
    LoginComponent,
    VerifyComponent,
    OnboardingComponent,
    ForgotPasswordComponent,
  ],
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    SharedModule,
  ],
})
export class AuthModule {}
