import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as AppAction from '../../store/app.actions';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'room-navigation',
  templateUrl: './room-navigation.component.html',
  styleUrls: ['./room-navigation.component.scss']
})
export class RoomNavigationComponent implements OnInit {

  appWise: Observable<fromApp.AppWise>;

  constructor(
    private store: Store<fromApp.AppState>
  ) { }

  ngOnInit(): void {
    this.appWise = this.store.select('appWise');
  }

  toggleRoomMenu() {
    this.store.dispatch(new AppAction.ToggleRoomNav());
  }

}
