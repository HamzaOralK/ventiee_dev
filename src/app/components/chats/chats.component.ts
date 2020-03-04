import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs/internal/Subscription';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/internal/Observable';
import * as fromAuth from '../../services/auth/store/auth.reducer';
import * as fromApp from '../../store/app.reducer';
import * as fromRoom from '../../services/dataServices/room/store/room.reducer';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

@Component({
  selector: 'chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {

  auth: Observable<fromAuth.State>;
  appWise: Observable<fromApp.AppWise>;
  rooms: Observable<fromRoom.State>;

  roomSearchText: Subject<string> = new Subject();
  subscription: Subscription = new Subscription();
  value: string = "";

  // chat: Room;

  constructor(
    private store: Store<fromApp.AppState>,
  ) {
    this.auth = this.store.select("authState");
    this.appWise = this.store.select("appWise");
    this.rooms = this.store.select("roomState");
    this.rooms.subscribe(p => console.log(p));
  }


  ngOnInit(): void {
    this.auth.subscribe(p => {
      if (p.user && p.token) {
        // this.eventService.getEvents();
      }
    });
    this.roomSearchText
      .pipe(debounceTime(500))
      .subscribe(p => console.log(p));
    this.subscription.add(this.roomSearchText);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onChange(event: any) {
    this.roomSearchText.next(event.target.value);
  }

  clearFilter() {
    this.value = "";
    this.roomSearchText.next(undefined);
  }
}
