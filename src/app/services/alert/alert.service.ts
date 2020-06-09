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
    audio.play();
  }
}
