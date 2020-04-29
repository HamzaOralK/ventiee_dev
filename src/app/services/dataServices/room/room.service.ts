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
import { Subscription, Subject } from 'rxjs';
import { NotificationService } from '../../notification/notification.service';
import { LangService } from '../../lang/lang.service';
import { MultiLanguagePipe } from 'src/app/shared/pipes/multi-language.pipe';

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
  msg: Subject<MMessage>;
  connected: boolean = false;

  private getMessagesSubscription: Subscription;

  constructor(
    private http: HttpClient,
    private store: Store<fromApp.AppState>,
    private roomStore: Store<fromRoom.State>,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private mlPipe: MultiLanguagePipe
  ) {
    this.msg = new Subject();
    this.subscription = new Subscription();
    this.store.select('roomState').subscribe(p => {
      this.activeRoom = p.activeRoom;
      this.rooms = p.rooms;
    });

    this.store.select('authState').subscribe(p => {
      this.user = p.user;

      if(this.user && !this.connected) {
        this.getRooms();
        this.socket = io(CONFIG.serviceURL, {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: Infinity
        });
        this.getMessagesSubscription = this.getMessages().subscribe((message: string) => {
          console.log(message);
        }, e => console.log(e));
        this.subscription.add(this.getMessagesSubscription);
        this.connected = true;
      }
    })

    this.url = CONFIG.serviceURL;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.connected = false;
  }

  getMessages() {
    return Observable.create((observer) => {
      if(this.socket) {
        this.socket.on('messageToClient', (message: Object) => {
            let incMessage = message['message'] as MMessage;
            let room = this.rooms.find(p => p._id === incMessage.eventId);
            this.roomStore.dispatch(new RoomAction.SendMessage({room: room, user: this.user, message: [incMessage]}));
            observer.next(message);
            this.msg.next(message as MMessage);
        });
      }
    });
  }

  sendMessage(room: Room, message: MMessage) {
    this.socket.emit('message', message);
  }

  changeRoom(roomId: string) {
    this.roomStore.dispatch(new RoomAction.ChangeActiveRoom({roomId}));
    let room = this.rooms.find(r => r._id === roomId);
    if(room && !room.messages)
      this.loadMessages(room);
  }

  joinRoom(room: Room) {
    let url = CONFIG.serviceURL + '/jUser/add';

    let postObj = {
      eventId: room._id,
      userId: this.user._id,
      joinDate: new Date()
    }

    this.http.post<any>(url, postObj).subscribe(res => {
        this.roomStore.dispatch(new RoomAction.JoinRoom({ room }));
        this.router.navigate(['/room/' + room._id]);
    }, e => console.log(e) );

  }

  getRooms() {
    let url = CONFIG.serviceURL + "/jUser/getEvents/" + this.authService.user._id;
    this.http.get<any>(url).subscribe(res => {
      let rooms = res as Room[];
      this.roomStore.dispatch(new RoomAction.GetRooms({ rooms }));
    }, error => {
      this.authService.logoutUser();
    });
  }

  formatLoadedMessages(p: {_id: string, eventId: string, messageDate: string, text: string, userId: string, userName: string}) {
    let m = new MMessage();
    m._id = p._id;
    m.eventId = p.eventId;
    m.date = new Date(p.messageDate);
    m.message = p.text;
    m.user = new User();
    m.user._id = p.userId;
    m.user.nickname = p.userName;
    return m;
  }

  getRoomUsers(room: Room) {
    let url = CONFIG.serviceURL + "/jUser/get/" + room._id;
    this.http.get<User[]>(url).subscribe(p => {
      this.roomStore.dispatch(new RoomAction.SetRoomUsers({room: room, users: p}))
    });
  }

  kickUser(eventId: string, userId: string) {
    let url = CONFIG.serviceURL + "/jUser/kick";
    let sendObj = {eventId, userId}
    this.http.post(url, sendObj).subscribe(p => {
      let room = this.rooms.find(p => p._id === eventId);
      let users = this.rooms.find(p => p._id === eventId).users.filter(u => u._id !== userId);
      this.roomStore.dispatch(new RoomAction.KickUser({room, userId}))
      this.notificationService.notify(this.mlPipe.transform('userKicked'));
    });
  }

  loadMessages(room: Room) {
    let url = CONFIG.serviceURL + "/messages/" + room._id;
    return this.http.get(url).subscribe((p: any[]) => {
      p = p.map(e => this.formatLoadedMessages(e));
      this.roomStore.dispatch(new RoomAction.LoadMessages({room: room, messages: p}));
      this.msg.next(undefined);
    });
  }
}
