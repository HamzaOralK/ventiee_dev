import { Injectable, OnDestroy } from '@angular/core';
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
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService implements OnDestroy {

  socket: SocketIOClient.Socket;
  rooms: Room[];
  activeRoom: Room;
  url: string;
  connectionOptions: any;
  user: User;
  subscription: Subscription;

  constructor(
    private http: HttpClient,
    private store: Store<fromApp.AppState>,
    private roomStore: Store<fromRoom.State>,
    private authService: AuthService,
    private router: Router
  ) {
    this.subscription = new Subscription();
    this.store.select('roomState').subscribe(p => {
      this.activeRoom = p.activeRoom;
      this.rooms = p.rooms;
    });
    this.store.select('authState').subscribe(p => {
      this.user = p.user;
      if(this.user)
        this.getRooms();
        this.socket = io(this.url, {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: Infinity
        });
        let getMessagesSubscription = this.getMessages()
        .subscribe((message: string) => {
          console.log(message);
        });
        this.subscription.add(getMessagesSubscription);
    })
    this.url = CONFIG.serviceURL;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getMessages() {
    return Observable.create((observer) => {
      if(this.socket) {
        this.socket.on('messageToClient', (message: Object) => {
            console.log(message);
            let incMessage = message['message'] as MMessage;
            let room = this.rooms.find(p => p._id === incMessage.roomId);
            this.roomStore.dispatch(new RoomAction.SendMessage({room: room, user: this.user, message: [incMessage]}));
            observer.next(message);
        });
        this.socket.on('nsList', (message: Object) => {
          console.log(message);
        });
      }
    });
  }

  sendMessage(room: Room, message: MMessage) {
    this.socket.emit('message', message);
  }

  changeRoom(roomId: string) {
    this.roomStore.dispatch(new RoomAction.ChangeActiveRoom({roomId}));
  }

  joinRoom(room: Room) {
    let url = CONFIG.serviceURL + '/jUser/add';
    console.log(url);
    let postObj = {
      eventId: room._id,
      userId: this.user.id,
      joinDate: new Date()
    }

    this.http.post<any>(url, postObj,this.authService.authHeader)
    .subscribe(res => {
      console.log(res);
      this.roomStore.dispatch(new RoomAction.JoinRoom({ room }));
      this.router.navigate(['/room/' + room._id]);
    }, e => console.log(e) );

  }

  getRooms() {
    let url = CONFIG.serviceURL + "/jUser/getEvents/" + this.authService.user.id;
    this.http.get<any>(url, this.authService.authHeader).subscribe(res => {
      let rooms = res as Room[]
      for(let i = 0; i < rooms.length; i++) {
        if (!rooms[i].messages) rooms[i].messages = [];
      }
      this.roomStore.dispatch(new RoomAction.GetRooms({ rooms }));
    });
  }

}
