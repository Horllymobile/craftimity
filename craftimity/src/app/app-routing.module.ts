import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { ExploreComponent } from './page/explore/explore.component';
import { WishlistsComponent } from './page/wishlists/wishlists.component';
import { LoginComponent } from './page/login/login.component';
import { PagePage } from './page/page.page';

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
        path: 'login',
        component: LoginComponent,
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
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
