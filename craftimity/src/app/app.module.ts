import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './core/shared/shared.module';
import { JwtModule } from '@auth0/angular-jwt';
import { ErrorInterceptor } from './core/interceptors/error.interceptor';
import { ScreenTrackingService } from '@angular/fire/analytics';
import { environment } from 'src/environments/environment';
import { AngularFireAnalytics } from '@angular/fire/compat/analytics';
import { AngularFireModule } from '@angular/fire/compat';
import { SelectAppComponent } from './select-app/select-app.component';
import { RequestInterceptor } from './core/interceptors/http.interceptor';

export function tokenGetter() {
  return localStorage.getItem('ACCESS_TOKEN');
}
@NgModule({
  declarations: [AppComponent, SelectAppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    SharedModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        // allowedDomains: ["*"],
        // disallowedRoutes: ["http://example.com/examplebadroute/"],
      },
    }),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    // provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    // provideAnalytics(() => getAnalytics()),
    // provideMessaging(() => getMessaging()),
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
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
    ScreenTrackingService,
    AngularFireAnalytics,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
