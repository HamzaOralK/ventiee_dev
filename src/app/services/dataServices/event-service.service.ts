import { Injectable } from '@angular/core';
import { Event } from '../../dtos/event';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { CONFIG } from '../../config';

import * as fromApp from '../../store/app.reducer';
import * as AppActitons from '../../store/app.actions';
import * as fromAuth from '../auth/store/auth.reducer';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })

export class EventService {
    auth: Observable<fromAuth.State>;

    constructor(
      private http: HttpClient,
      private store: Store<fromApp.AppState>,
      private authService: AuthService
    ) {
      this.auth = this.store.select('authState');
      this.auth.subscribe(p => {
        if(p.token && p.user) {
          this.getEvents();
        }
      })
    }

    getEvents(eventTitle: string = undefined) {
       let url = CONFIG.serviceURL + '/events';
        this.http.get<Event[]>(url, this.authService.authHeader)
        .pipe(catchError(err => {
          throw err
        }))
        .subscribe(
        (result: any) => {
          this.store.dispatch(new AppActitons.GetEvents(Object.values(result)));
        },
        error => {
          if(error.status === 401) {
            this.authService.logoutUser();
          }
        });
    }

    getEventById(id: string) {
      let url = CONFIG.serviceURL + '/event/get/' + id;
      return this.http.get<Event>(url, this.authService.authHeader);
    }

    // addEvent(event: Event) {
      // this.http.post<Event>(CONFIG.serviceURL + '/events.json', event).subscribe((result) => {
          // console.log(result);
      // });
    // }


}
