import { isPlatform } from '@ionic/angular';

export function getPlaform() {
  if (isPlatform('android')) {
    return 'android';
  } else if (isPlatform('iphone')) {
    return 'ios';
  } else {
    return 'web';
  }
}
