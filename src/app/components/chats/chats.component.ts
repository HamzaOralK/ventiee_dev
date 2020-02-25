import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs/internal/Subscription';
import { EventService } from 'src/app/services/dataServices/event-service.service';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/internal/Observable';
import * as fromAuth from "../../services/auth/store/auth.reducer";
import * as fromApp from "../../store/app.reducer";
import * as AppAction from "../../store/app.actions";
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Room } from 'src/app/dtos/room';

@Component({
  selector: 'chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {

  auth: Observable<fromAuth.State>;
  appWise: Observable<fromApp.AppWise>;

  chatSearchText: Subject<string> = new Subject();
  subscription: Subscription = new Subscription();
  value: string = "";

  chat: Room;

  constructor(
    private store: Store<fromApp.AppState>,
  ) {
    this.auth = this.store.select("authState");
    this.appWise = this.store.select("appWise");
  }


  ngOnInit(): void {
    this.auth.subscribe(p => {
      if (p.user && p.token) {
        // this.eventService.getEvents();
      }
    });
    this.chatSearchText
      .pipe(debounceTime(500))
      .subscribe(p => console.log(p));
    this.subscription.add(this.chatSearchText);
    this.chat = new Room();
    this.chat._id = "123";
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onChange(event: any) {
    this.chatSearchText.next(event.target.value);
  }

  clearFilter() {
    this.value = "";
    this.chatSearchText.next(undefined);
  }
}
