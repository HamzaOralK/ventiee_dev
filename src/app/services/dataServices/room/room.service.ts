import { Injectable } from '@angular/core';
import { Room } from 'src/app/dtos/room';
import { Store } from '@ngrx/store';
import * as fromRoom from './store/room.reducer';
import * as fromApp from '../../../store/app.reducer';
import * as RoomAction from './store/room.actions';
import { MMessage } from 'src/app/dtos/message';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  rooms: Room[];
  activeRoom: Room;

  constructor(private store: Store<fromApp.AppState>, private roomStore: Store<fromRoom.State>) {
    this.store.select('roomState').subscribe(p => {
      this.activeRoom = p.activeRoom;
      this.rooms = p.rooms;
    });
  }
  getMessages() {
    this.roomStore.dispatch(new RoomAction.GetMessage({room: this.activeRoom}));
  }

  sendMessage(room: Room, message: MMessage) {
    this.store.dispatch(new RoomAction.SendMessage({room, message: [message] }))
  }

  changeRoom(roomId: string) {
    this.roomStore.dispatch(new RoomAction.ChangeActiveRoom({roomId}));
  }
}
