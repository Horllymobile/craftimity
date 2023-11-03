import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { register } from 'swiper/element/bundle';

if (environment.production) {
  enableProdMode();
  // console.log = () => {};
}

register();
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));
