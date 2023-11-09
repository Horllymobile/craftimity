import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { AuthGuard } from '../core/guards/auth/auth.guard';
import { SessionGuard } from '../core/guards/session/session.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
    canActivate: [SessionGuard],
  },
  {
    path: 'pages',
    loadChildren: () =>
      import('./pages/pages.module').then((m) => m.PagesPageModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
})
export class CraftivityModule {}
