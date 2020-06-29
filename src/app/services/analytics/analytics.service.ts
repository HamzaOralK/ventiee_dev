import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  sendEvent(eventCategory: string, eventLabel: string, eventAction:string) {
    let obj = {
      hitType: "event",
      eventCategory,
      eventLabel,
      eventAction,
    };
    (<any>window).ga("send", obj);
  }
}
