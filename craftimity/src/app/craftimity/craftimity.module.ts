import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth/auth.guard';
import { PagePage } from './page/page.page';
import { ExploreComponent } from './page/explore/explore.component';
import { WishlistsComponent } from './page/wishlists/wishlists.component';
import { SessionGuard } from '../core/guards/session/session.guard';
import { IonicModule } from '@ionic/angular';
import { PagePageModule } from './page/page.module';
import { AdminModule } from './admin/admin.module';

const routes: Routes = [
  {
    path: 'page',
    component: PagePage,
    children: [
      {
        path: '',
        redirectTo: 'explore',
        pathMatch: 'full',
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./page/auth/auth.module').then((m) => m.AuthModule),
      },
      {
        path: 'explore',
        component: ExploreComponent,
      },
      {
        path: 'wishlists',
        component: WishlistsComponent,
      },
    ],
    // canActivate: [SessionGuard],
  },
  // {
  //   path: 'admin',
  //   loadChildren: () =>
  //     import('./admin/admin.module').then((m) => m.AdminModule),
  //   canActivate: [AuthGuard],
  // },
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    IonicModule,
    PagePageModule,
    AdminModule,
    RouterModule.forChild(routes),
  ],
})
export class CraftimityModule {}
