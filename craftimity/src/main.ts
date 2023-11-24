import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import { register } from 'swiper/element/bundle';

import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);

if (environment.production) {
  enableProdMode();
  // console.log = () => {};
}

register();
platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.log(err));
