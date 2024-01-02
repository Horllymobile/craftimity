import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { SwipperDirective } from '../core/directives/fm-swipper.directive';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import {
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideAnimations(),
    provideHttpClient(withFetch()),
    importProvidersFrom([CommonModule, HttpClientModule, SwipperDirective]),
  ],
};
