import { Injectable } from '@angular/core';
import { Event } from '../../dtos/event';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { CONFIG } from '../../config';

import * as fromApp from '../../store/app.reducer';
import * as AppActitons from '../../store/app.actions';

@Injectable({ providedIn: 'root' })

export class EventService {
    constructor(
        private http: HttpClient,
        private store: Store<fromApp.AppWise>
    ) {}

    getEvents() {
        this.http.get<Event[]>(CONFIG.serviceURL + '/events.json').subscribe((result: any) => {
            console.log(Object.values(result));
            this.store.dispatch(new AppActitons.GetEvents(Object.values(result)));
        });
    }

    addEvent(event: Event) {
        this.http.post<Event>(CONFIG.serviceURL + '/events.json', event).subscribe((result) => {
            console.log(result);
        });
    }

}
