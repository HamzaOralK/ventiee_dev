import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { }

  play() {
    let audio = new Audio();
    audio.src = "./assets/audio/notification.wav";
    audio.load();
    var promise = audio.play();
    if (promise) {
      promise.catch(function (error) { console.error(error); });
    }

  }
}
