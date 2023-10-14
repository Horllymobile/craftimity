import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { PagePage } from './page.page';
import { LoginComponent } from './login/login.component';
import { ExploreComponent } from './explore/explore.component';
import { WishlistsComponent } from './wishlists/wishlists.component';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule],
  declarations: [
    PagePage,
    LoginComponent,
    ExploreComponent,
    WishlistsComponent,
  ],
})
export class PagePageModule {}
