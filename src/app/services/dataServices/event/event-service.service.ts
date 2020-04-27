import { Injectable } from '@angular/core';
import { Event } from '../../../dtos/event';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { CONFIG } from '../../../config';

import * as fromApp from '../../../store/app.reducer';
import * as AppActitons from '../../../store/app.actions';
import * as fromAuth from '../../auth/store/auth.reducer';
import * as fromRoom from '../../../services/dataServices/room/store/room.reducer';
import * as RoomActions from '../../../services/dataServices/room/store/room.actions';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { Room } from 'src/app/dtos/room';
import { Subscription } from 'rxjs';
import { LangService } from '../../lang/lang.service';
import { NotificationService } from '../../notification/notification.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })

export class EventService {
    auth: Observable<fromAuth.State>;
    roomState: Observable<fromRoom.State>;
    joinedRooms: Room[];
    subscription = new Subscription();

    constructor(
      private http: HttpClient,
      private store: Store<fromApp.AppState>,
      private roomStore: Store<fromRoom.State>,
      private authService: AuthService,
      private langService: LangService,
      private notificationService: NotificationService,
      private router: Router
    ) {
      this.auth = this.store.select('authState');
      this.roomState = this.store.select('roomState');

      this.roomState.subscribe(p =>  {
        this.joinedRooms = p.rooms;
        this.auth.subscribe(p => {
          if (p.token && p.user) {
            this.getEvents();
          }
        });
      });
    }

    getEvents(eventTitle: string = undefined) {
      let url = CONFIG.serviceURL + '/events';
      this.http.get<Event[]>(url)
        .pipe(catchError(err => {
          throw err
        }))
        .subscribe(
          (result: any) => {
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
      return this.http.get<Event>(url);
    }

    getEventsByModId(userId: string) {
      let url = CONFIG.serviceURL + '/events/get/' + userId;
      return this.http.get<Event[]>(url);
    }

    addEvent(event: Event) {
      return this.http.post<any>(CONFIG.serviceURL + "/event/add", event).subscribe(p => {
        if (p._id) {
          this.store.dispatch(new RoomActions.JoinRoom({room: event as Room}));
          this.notificationService.notify(this.langService.get("eventCreateSuccess"), "OK");
          this.router.navigate(["/room/" + p._id]);
        }
      });
    }

}
