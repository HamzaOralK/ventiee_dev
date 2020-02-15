import { Injectable } from '@angular/core';
import { Event } from '../../dtos/event';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { CONFIG } from '../../config';

import * as fromApp from '../../store/app.reducer';
import * as AppActitons from '../../store/app.actions';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })

export class EventService {
    constructor(
      private http: HttpClient,
      private store: Store<fromApp.AppWise>,
      private authService: AuthService
    ) {}

    getEvents(eventTitle: string = undefined) {
      if(this.authService.isLoggedIn) {
        let url = CONFIG.serviceURL + '/events.json';
        if(eventTitle) {
          url = url + '?orderBy="title"&startAt="' + eventTitle + '"';
        }
        this.http.get<Event[]>(url).subscribe(
        (result: any) => {
          console.log(Object.values(result));
          this.store.dispatch(new AppActitons.GetEvents(Object.values(result)));
        },
        error => {
          if(error.error === 'not found') {
            this.store.dispatch(new AppActitons.GetEvents([]));
          }
        });
      }
    }

    getEventById(id: string) {
      let url = CONFIG.serviceURL + '/events.json?orderBy="id"&equalTo="' + id + '"';
      return this.http.get<Event>(url);
    }

    addEvent(event: Event) {
      this.http.post<Event>(CONFIG.serviceURL + '/events.json', event).subscribe((result) => {
          console.log(result);
      });
    }

}
