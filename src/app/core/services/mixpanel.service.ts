import { Injectable } from '@angular/core';
import mixpanel from 'mixpanel-browser';
import { constant } from '../constants/constant';

@Injectable({
  providedIn: 'root',
})
export class MixpanelService {
  init() {
    mixpanel.init(constant.MIXPANEL_TOKEN, {
      debug: true,
      loaded: (mixpanel) => {
        const distinct_id = mixpanel.get_distinct_id();
      },
    });
  }

  hasOwnProperty() {
    return mixpanel.get_property('get_distinct_id');
  }

  track(event: string, data: any) {
    mixpanel.track(event, data);
  }

  identify(id: string) {
    mixpanel.identify(id);
  }

  alias(user: { name: string; email: string }) {
    // mixpanel.alias()
  }
}
