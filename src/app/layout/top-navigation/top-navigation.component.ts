import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AppAction from '../../store/app.actions'
import { Observable } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import * as fromAuth from '../../services/auth/store/auth.reducer';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/dtos/user';
import { EventService } from 'src/app/services/dataServices/event/event-service.service';

@Component({
  selector: 'top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.scss']
})
export class TopNavigationComponent implements OnInit {

  auth: Observable<fromAuth.State>;
  user: User;
  unreadMessages: number;

  constructor(
    private store: Store<fromApp.AppState>,
    private authService: AuthService,
    private eventService: EventService
  ) { }

  ngOnInit() {
    this.store.select('authState').subscribe(p => {
      this.user = p.user;
    });
    this.store.select('roomState').subscribe(p => {
      this.unreadMessages = p.unreadMessages;
    });
  }

  toggleLeftMenu() {
    this.store.dispatch(new AppAction.ToggleLeftNav());
  }

  logOut() {
    this.authService.logoutUser();
  }

  getEvents() {
    this.eventService.getEvents();
  }

}
