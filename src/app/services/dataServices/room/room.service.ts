import { Injectable } from '@angular/core';
import { Room } from 'src/app/dtos/room';
import { Store } from '@ngrx/store';
import * as fromRoom from './store/room.reducer';
import * as fromApp from '../../../store/app.reducer';
import * as RoomAction from './store/room.actions';
import { MMessage } from 'src/app/dtos/message';
import * as io from 'socket.io-client';
import { CONFIG } from 'src/app/config';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/dtos/user';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  socket: SocketIOClient.Socket;
  rooms: Room[];
  activeRoom: Room;
  url: string;
  connectionOptions: any;
  user: User;

  constructor(
    private httpClient: HttpClient,
    private store: Store<fromApp.AppState>, 
    private roomStore: Store<fromRoom.State>
  ) {
    this.store.select('roomState').subscribe(p => {
      this.activeRoom = p.activeRoom;
      this.rooms = p.rooms;
    });
    this.store.select('authState').subscribe(p => {
      this.user = p.user;
    })
    this.url = CONFIG.serviceURL;
  }

  connectRoom() {
    if(this.activeRoom && this.activeRoom._id) {
      console.log(this.activeRoom, this.activeRoom._id);
      this.socket = io(this.url);
    }
  }

  getMessages() {
    return Observable.create((observer) => {
      this.socket.on('messageToClient', (message: Object) => {
          let incMessage = message['message'] as MMessage;
          if(incMessage.user.email !== this.user.email)
            this.roomStore.dispatch(new RoomAction.SendMessage({room: this.activeRoom, message: [incMessage]}));
          observer.next(message);
      });
    });
  }

  sendMessage(room: Room, message: MMessage) {
    this.socket.emit('message', message);
    console.log(message);
    this.store.dispatch(new RoomAction.SendMessage({room, message: [message] }));
  }

  changeRoom(roomId: string) {
    this.roomStore.dispatch(new RoomAction.ChangeActiveRoom({roomId}));
  }
}
