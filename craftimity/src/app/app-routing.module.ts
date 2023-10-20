import { NgModule, inject } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ExploreComponent } from './page/explore/explore.component';
import { WishlistsComponent } from './page/wishlists/wishlists.component';
import { PagePage } from './page/page.page';
import { AuthGuard } from './core/guards/auth/auth.guard';
import { SessionGuard } from './core/guards/session/session.guard';

const routes: Routes = [
  {
    path: '',
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
    canActivate: [SessionGuard],
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.HomePageModule),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
