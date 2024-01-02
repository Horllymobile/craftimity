import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PagePage } from './page.page';
import { ExploreComponent } from './explore/explore.component';
import { WishlistsComponent } from './wishlists/wishlists.component';
import { AuthModule } from './auth/auth.module';
import { RouterModule, Routes } from '@angular/router';
import { SwipperDirective } from '../core/directives/fm-swipper.directive';
import { SharedModule } from '../core/shared/shared.module';
import { CategorySliderComponent } from '../components/category-slider/category-slider.component';

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
    SharedModule,
    RouterModule.forChild(routes),
    CategorySliderComponent,
  ],
  declarations: [PagePage, ExploreComponent, WishlistsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PagePageModule {}
