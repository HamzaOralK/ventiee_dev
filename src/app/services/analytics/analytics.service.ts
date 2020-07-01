import { Injectable, isDevMode } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  sendEvent(eventCategory: string, eventLabel: string, eventAction:string) {
    if (!isDevMode()) {
      let obj = {
        hitType: "event",
        eventCategory,
        eventLabel,
        eventAction,
      };
      (<any>window).ga("send", obj);
    }
  }
}
