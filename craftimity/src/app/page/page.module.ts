import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PagePage } from './page.page';
import { ExploreComponent } from './explore/explore.component';
import { WishlistsComponent } from './wishlists/wishlists.component';
import { AuthModule } from './auth/auth.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AuthModule,
  ],
  declarations: [PagePage, ExploreComponent, WishlistsComponent],
})
export class PagePageModule {}
