import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth/auth.guard';
import { PagePage } from './page/page.page';
import { SessionGuard } from '../core/guards/session/session.guard';
import { IonicModule } from '@ionic/angular';

const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'page',
    component: PagePage,
    loadChildren: () =>
      import('./page/page.module').then((m) => m.PagePageModule),
    canActivate: [SessionGuard],
  },
  {
    path: '',
    redirectTo: 'page',
    pathMatch: 'full',
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
})
export class CraftimityModule {}
