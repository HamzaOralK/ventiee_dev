import {Component, OnDestroy, OnInit, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromAuth from '../../services/auth/store/auth.reducer';
import * as fromApp from '../../store/app.reducer';
import * as fromRoom from '../../services/dataServices/room/store/room.reducer';
import { Room } from 'src/app/dtos/room';
import { Subject, Subscription, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as AppAction from "../../store/app.actions";
import { Router } from '@angular/router';
import { NotificationService, SnackType } from 'src/app/services/notification/notification.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit, OnDestroy, AfterViewInit {

  currentModRoomsQuantity: number = 0;

  auth: Observable<fromAuth.State>;
  appWise: Observable<fromApp.AppWise>;
  roomState: Observable<fromRoom.State>;

  rooms: Room[] = [];
  filteredRooms: Room[] = [];

  roomSearchText: Subject<string> = new Subject();
  subscription: Subscription = new Subscription();
  value = '';

  // chat: Room;

  constructor(
    private store: Store<fromApp.AppState>,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private notificationService: NotificationService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.auth = this.store.select('authState');
    this.appWise = this.store.select('appWise');
    this.roomState = this.store.select('roomState');
  }

  ngAfterViewInit() {
    this.roomState.subscribe(p => {
      if(p) {
        this.rooms = p.rooms;
        this.filteredRooms = p.rooms;
        if (p && p.rooms) {
          let modedRooms = p.rooms.filter(r => {
            return r.moderatorUserId === this.authService.user._id || r.moderatorUser._id === this.authService.user._id;
          });
          this.currentModRoomsQuantity = modedRooms.length;
        };
        this.cdr.detectChanges();
      }
    });

    this.auth.subscribe(p => {
      if (p.user && p.token) { }
    });

    this.roomSearchText
      .pipe(debounceTime(500))
      .subscribe(p => {
        this.filterRooms(p);
      });
    this.subscription.add(this.roomSearchText);

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onChange(event: any) {
    this.roomSearchText.next(event.target.value);
  }

  filterRooms(roomTitle: string) {
    if(roomTitle !== "" && roomTitle !== undefined) {
      this.filteredRooms = this.rooms.filter(p => p.title.toLowerCase().search(roomTitle.toLowerCase()) > -1);
    } else {
      this.filteredRooms = this.rooms;
    }
  }

  clearFilter() {
    this.value = "";
    this.roomSearchText.next(undefined);
  }


  createEvent() {
    if (this.currentModRoomsQuantity < environment.maxRoomNumber) {
      this.store.dispatch(new AppAction.ToggleLeftNav(false));
      this.router.navigate(["/createEvent"]);
    } else {
      this.notificationService.notify("maxRoomNumberReached", SnackType.warn, "OK");
    }
  }
}
