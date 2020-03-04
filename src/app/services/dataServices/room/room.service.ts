import { Injectable } from '@angular/core';
import { Room } from 'src/app/dtos/room';
import { Store } from '@ngrx/store';
import * as fromRoom from './store/room.reducer';
import * as RoomAction from './store/room.actions';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  constructor(private store: Store<fromRoom.State>) { }
  getMessages(room: Room) {
    this.store.dispatch(new RoomAction.GetMessage({room}));
  }
}
