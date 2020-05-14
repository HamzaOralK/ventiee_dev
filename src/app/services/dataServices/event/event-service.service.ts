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
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { Room } from 'src/app/dtos/room';
import { Subscription } from 'rxjs';
import { LangService } from '../../lang/lang.service';
import { NotificationService } from '../../notification/notification.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: "root" })
export class EventService {
  auth: Observable<fromAuth.State>;
  roomState: Observable<fromRoom.State>;
  joinedRooms: Room[];
  subscription = new Subscription();
  events: any[];

  _pageNo: number;

  constructor(
    private http: HttpClient,
    private store: Store<fromApp.AppState>,
    private authService: AuthService,
    private langService: LangService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.auth = this.store.select("authState");
    this.roomState = this.store.select("roomState");
    this._pageNo = 1;

    this.roomState.subscribe((p) => {
      if (p) this.joinedRooms = p.rooms;
    });
  }

  getEvents(search?: string) {
    let url = CONFIG.serviceURL + "/events";
    let params: { pageNo: string; search?: string } = {
      pageNo: "1",
    };

    if (search) {
      params.search = search;
    }

    return this.http
      .get<Event[]>(url, {
        params,
      })
      .pipe(
        map((result: any) => {
          if (result) {
            this._pageNo = 2;
            let r = result.filter(
              (elem) => !this.joinedRooms.find(({ _id }) => elem._id === _id)
            );
            this.store.dispatch(new AppActitons.GetEvents(Object.values(r)));
          }
        }),
        catchError((error) => {
          if (error.status === 401) {
            this.authService.logoutUser();
          }
          throw error;
        })
      );
  }

  loadMoreEvents(search?: string) {
    let url = CONFIG.serviceURL + "/events";
    let params: { pageNo: string; search?: string } = {
      pageNo: this._pageNo.toString()
    };

    if (search) {
      params.search = search;
    }

    return this.http
      .get<Event[]>(url, {
        params
      })
      .pipe(
        map((result: any) => {
          if (result) {
            let r = result.filter(
              (elem) => !this.joinedRooms.find(({ _id }) => elem._id === _id)
            );
            this.store.dispatch(
              new AppActitons.LoadMoreEvents(Object.values(r))
            );
            if (r && r.length > 0) this._pageNo++;
            return r;
          }
        }),
        catchError((error) => {
          if (error.status === 401) {
            this.authService.logoutUser();
          }
          throw error;
        })
      );
  }

  getEventById(id: string) {
    let url = CONFIG.serviceURL + "/event/get/" + id;
    return this.http.get<Event>(url);
  }

  getEventsByModId(userId: string) {
    let url = CONFIG.serviceURL + "/events/get/" + userId;
    return this.http.get<Event[]>(url);
  }

  addEvent(event: Event) {
    return this.http
      .post<any>(CONFIG.serviceURL + "/event/add", event)
      .subscribe((p) => {
        console.log(p);
        if (p._id) {
          let room = { ...event, _id: p._id };
          this.store.dispatch(new RoomActions.JoinRoom({ room: room as Room }));
          this.notificationService.notify(
            this.langService.get("eventCreateSuccess"),
            "OK"
          );
          this.router.navigate(["/room/" + p._id]);
        }
      });
  }
}
