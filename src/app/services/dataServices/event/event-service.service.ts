import { Injectable } from '@angular/core';
import { Event, EventFilter } from '../../../dtos/event';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import * as fromApp from '../../../store/app.reducer';
import * as AppActions from '../../../store/app.actions';
import * as fromAuth from '../../auth/store/auth.reducer';
import * as fromRoom from '../../../services/dataServices/room/store/room.reducer';
import * as RoomActions from '../../../services/dataServices/room/store/room.actions';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { Room, RoomUser } from 'src/app/dtos/room';
import { Subscription } from 'rxjs';
import { NotificationService, SnackType } from '../../notification/notification.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/dtos/user';
import { COMMONS } from 'src/app/shared/commons';
import { AppService } from 'src/app/app.service';
import { RoomService } from '../room/room.service';

@Injectable({ providedIn: "root" })
export class EventService {
  auth: Observable<fromAuth.State>;
  roomState: Observable<fromRoom.State>;
  joinedRooms: Room[];
  subscription = new Subscription();
  events: any[];

  user: User;
  _isAll: boolean = false;

  constructor(
    private http: HttpClient,
    private store: Store<fromApp.AppState>,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router,
    private appService: AppService,
    private roomService: RoomService
  ) {
    this.auth = this.store.select("authState");
    this.auth.subscribe(p => {
      if(p.user) {
        this.user = p.user;
      }
    })
    this.roomState = this.store.select("roomState");

    this.roomState.subscribe((p) => {
      if (p) this.joinedRooms = p.rooms;
    });
  }

  getEvents(pageNo: number = 1, search?: string, eventFilter?: EventFilter ) {
    this._isAll = false;
    let url = environment.serviceURL + "/events";
    let params: { pageNo: string; search?: string, userId?: string } = {
      pageNo: pageNo.toString(),
      userId: this.user._id
    };

    if (search) {
      params.search = search;
    }

    return this.http
      .post<Event[]>(url, { ...eventFilter }, { params })
      .pipe(
        map((result: any) => {
          if (result) {
            let r = result.filter(
              (elem) => !this.joinedRooms.find(({ _id }) => elem._id === _id)
            );
            if(pageNo === 1 && r.length > 0) this.store.dispatch(new AppActions.GetEvents(Object.values(r)));
            else if (pageNo > 1 && r.length > 0) this.store.dispatch(new AppActions.LoadMoreEvents(Object.values(r)));
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
    let url = environment.serviceURL + "/event/get/" + id;
    return this.http.get<Event>(url);
  }

  getEventsByModId(userId: string) {
    let url = environment.serviceURL + "/events/get/" + userId;
    return this.http.get<Event[]>(url);
  }

  addEvent(event: Event) {
    this.appService.loading = true;
    let url = environment.serviceURL + "/event/add";
    return this.http
      .post<any>(url, event)
      .subscribe((p) => {
        this.appService.loading = false;
        if (p._id) {
          let room: Room = { ...event, _id: p._id, users: [], messages: [], imageURI: p.imageURI };
          room.moderatorUser = new User();
          room.moderatorUser = this.user;
          let roomUser = new RoomUser();
          roomUser.user = this.user;
          roomUser.color = COMMONS.generateRandomRGBAColor();
          room.currentPeopleCount = 0;
          room.users.push(roomUser);
          this.store.dispatch(new RoomActions.JoinRoom({ room: room as Room }));
          this.notificationService.notify("eventCreateSuccess");
          if (this.appService.smallScreen) this.router.navigate(["/room/" + p._id]);
          else this.router.navigate(["/home"]);
          this.roomService.joinSocketRoom(room._id, true);
        }
      }, (e) => {
        this.appService.loading = false;
        if (e.error && e.error.code === 'E15')
          this.notificationService.notify("sameNameEvent", SnackType.warn);
      });
  }

  getTags() {
    let url = environment.serviceURL + "/tags";
    return this.http.get(url);
  }

  /** Past Events Section */

  getHistoryEventsOfUser(pageNo: number, search?: string) {
    let url = environment.serviceURL + "/jUser/pastEvents/" + this.user._id;
    let params: { pageNo: string; search?: string } = {
      pageNo: pageNo.toString(),
    };

    if (search) {
      params.search = search;
    }

    return this.http
      .post<Event[]>(url, { }, {
        params,
      })
      .pipe(
        map((result: any) => {
          if (result) {
            if (pageNo === 1) this.store.dispatch(new AppActions.GetHistoryEvents(Object.values(result)));
            else if (pageNo > 1) this.store.dispatch(new AppActions.LoadMoreHistoryEvents(Object.values(result)));
            return result;
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
  /******************* Past Events Section */

}
