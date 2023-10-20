import { NgModule } from "@angular/core";
import {
  BrowserModule,
  provideClientHydration,
} from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SharedModule } from "./core/shared/shared.module";
import { ComponentsModule } from "./components/components.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MaterialModule } from "./core/shared/material.module";
import { HomeModule } from "./home/home.module";
import { AuthModule } from "./auth/auth.module";
import { WishlistsModule } from "./wishlists/wishlists.module";
import { CommingSoonComponent } from "./comming-soon/comming-soon.component";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [AppComponent, CommingSoonComponent],
  imports: [
    BrowserModule,
    // WishlistsModule,
    // HomeModule,
    // AuthModule,
    AppRoutingModule,
    SharedModule,
    MaterialModule,
    ComponentsModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  // providers: [provideClientHydration()],
  bootstrap: [AppComponent],
})
export class AppModule {}
