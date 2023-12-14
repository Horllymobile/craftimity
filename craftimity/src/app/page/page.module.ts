import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PagePage } from './page.page';
import { ExploreComponent } from './explore/explore.component';
import { WishlistsComponent } from './wishlists/wishlists.component';
import { AuthModule } from './auth/auth.module';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'explore',
    pathMatch: 'full',
  },
  {
    path: 'explore',
    component: ExploreComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AuthModule,
    RouterModule.forChild(routes),
  ],
  declarations: [PagePage, ExploreComponent, WishlistsComponent],
})
export class PagePageModule {}
