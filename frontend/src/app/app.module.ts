import { NgModule } from "@angular/core";
import {
  BrowserModule,
  provideClientHydration,
} from "@angular/platform-browser";

import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";

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
import { ErrorInterceptor } from "./core/interceptors/error.interceptor";
import { RequestInterceptor } from "./core/interceptors/http.interceptor";
import { JwtModule } from "@auth0/angular-jwt";
import { STORAGE_VARIABLES } from "./core/constants/storage";
import { NotFoundComponent } from "./not-found/not-found.component";

export async function tokenGetter() {
  return localStorage.getItem(STORAGE_VARIABLES.TOKEN);
}

@NgModule({
  declarations: [AppComponent, CommingSoonComponent, NotFoundComponent],
  imports: [
    BrowserModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        // allowedDomains: ["*"],
        // disallowedRoutes: ["http://example.com/examplebadroute/"],
      },
    }),
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
  providers: [
    provideClientHydration(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
