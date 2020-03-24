import { Injectable } from '@angular/core';
import { Event } from '../../../dtos/event';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { CONFIG } from '../../../config';

import * as fromApp from '../../../store/app.reducer';
import * as AppActitons from '../../../store/app.actions';
import * as fromAuth from '../../auth/store/auth.reducer';
import * as fromRoom from '../../../services/dataServices/room/store/room.reducer';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { Room } from 'src/app/dtos/room';

@Injectable({ providedIn: 'root' })

export class EventService {
    auth: Observable<fromAuth.State>;
    roomState: Observable<fromRoom.State>;
    joinedRooms: Room[];

    constructor(
      private http: HttpClient,
      private store: Store<fromApp.AppState>,
      private authService: AuthService
    ) {
      this.auth = this.store.select('authState');
      this.roomState = this.store.select('roomState');

      this.roomState.subscribe(p =>  {
        this.joinedRooms = p.rooms;
      });

      this.auth.subscribe(p => {
        if(p.token && p.user) {
          this.getEvents();
        }
      });
    }

    getEvents(eventTitle: string = undefined) {
      let url = CONFIG.serviceURL + '/events';
      this.http.get<Event[]>(url, this.authService.authHeader)
        .pipe(catchError(err => {
          throw err
        }))
        .subscribe(
          (result: any) => {
            console.log(result);
            let r = result.filter((elem) => !this.joinedRooms.find(({ _id }) => elem._id === _id));
            this.store.dispatch(new AppActitons.GetEvents(Object.values(r)));
          },
          error => {
            if(error.status === 401) {
              this.authService.logoutUser();
            }
          }
        );
    }

    getEventById(id: string) {
      let url = CONFIG.serviceURL + '/event/get/' + id;
      return this.http.get<Event>(url, this.authService.authHeader);
    }

    addEvent(event: Event) {
      return this.http.post<any>(CONFIG.serviceURL + "/event/add", event, this.authService.authHeader);
    }

}
