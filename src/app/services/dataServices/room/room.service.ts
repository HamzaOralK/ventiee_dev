import { Injectable, OnDestroy } from '@angular/core';
import { Room } from 'src/app/dtos/room';
import { Store } from '@ngrx/store';
import * as fromRoom from './store/room.reducer';
import * as fromApp from '../../../store/app.reducer';
import * as RoomAction from './store/room.actions';
import { MMessage, MessageType } from 'src/app/dtos/message';
import * as io from 'socket.io-client';
import { CONFIG } from 'src/app/config';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/dtos/user';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { NotificationService } from '../../notification/notification.service';
import { MultiLanguagePipe } from 'src/app/shared/pipes/multi-language.pipe';
import { COMMONS } from 'src/app/shared/commons';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';

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
        this.getMessagesSubscription = this.getMessages().subscribe((message: string) => { }, e => console.log(e));
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
          this.insertMessage(message, observer);
        });
        this.socket.on('joinRoom', (message: any)=> {
          this.insertMessage(message, observer);
        })
      }
    });
  }

  private insertMessage(message: Object, observer: any) {
    let incMessage = message['message'] as MMessage;
    console.log(incMessage);
    let room = this.rooms.find(p => p._id === incMessage.eventId);
    this.roomStore.dispatch(new RoomAction.SendMessage({ room: room, user: this.user, message: [incMessage] }));
    if (incMessage.type === MessageType.NewUser) {
      this.roomStore.dispatch(new RoomAction.InsertUser({ roomId: room._id, user: message["message"].user }));
    }
    observer.next(message);
    this.msg.next(message as MMessage);
  }

  private insertNewUser(message: Object, observer: any) {
    this.roomStore.dispatch(new RoomAction.InsertUser({ roomId: message["message"].eventId, user: message["message"].user}));
    let notificationMessage = new MMessage();
    notificationMessage._id = COMMONS.generateUUID();
    notificationMessage.type = MessageType.NewUser;
    notificationMessage.user = message["message"].user;
  }

  sendMessage(room: Room, message: MMessage) {
    this.socket.emit('message', message);
  }

  changeRoom(roomId: string) {
    this.roomStore.dispatch(new RoomAction.ChangeActiveRoom({roomId}));
    if(this.rooms) {
      let room = this.rooms.find(r => r._id === roomId);
      if(room && !room.messages) {
        this.loadMessages(room);
        this.getRoomUsers(room);
      }
    }
  }

  emptyActiveRoom() {
    this.roomStore.dispatch(new RoomAction.ChangeActiveRoom({roomId: undefined}))
  }

  joinRoom(room: Room) {
    let url = CONFIG.serviceURL + '/jUser/add';

    let postObj = {
      eventId: room._id,
      userId: this.user._id,
      joinDate: new Date()
    }

    this.http.post<any>(url, postObj).subscribe(res => {
      this.roomStore.dispatch(new RoomAction.JoinRoom({ room: res.obj }));
      this.joinSocketRoom(room._id, true);
      this.router.navigate(['/room/' + room._id]);
    }, e => {
      this.notificationService.notify(this.mlPipe.transform(e.error.code));
    });

  }

  getRooms() {
    let url = CONFIG.serviceURL + "/jUser/getEvents/" + this.authService.user._id;
    this.http.get<any>(url).subscribe(res => {
      let rooms = res as Room[];
      this.roomStore.dispatch(new RoomAction.GetRooms({ rooms }));
      rooms.forEach(r => {
        this.joinSocketRoom(r._id);
      });
    }, error => {
      this.authService.logoutUser();
    });
  }

  formatLoadedMessages(p: {_id: string, eventId: string, messageDate: string, text: string, userId: string, userName: string, type: number}) {
    let m = new MMessage();
    m._id = p._id;
    m.eventId = p.eventId;
    m.date = new Date(p.messageDate);
    m.message = p.text;
    m.user = new User();
    m.user._id = p.userId;
    m.user.nickname = p.userName;
    m.type = p.type;
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
      this.roomStore.dispatch(new RoomAction.KickUser({room, userId}))
      this.notificationService.notify(this.mlPipe.transform('userKicked'));
    });
  }

  leaveRoom(eventId: string, userId: string) {
    let url = CONFIG.serviceURL + "/jUser/leave";
    let sendObj = { eventId, userId }
    this.http.post(url, sendObj).subscribe(p => {
      let room = this.rooms.find(p => p._id === eventId);
      this.roomStore.dispatch(new RoomAction.LeaveRoom({ room }))
      this.router.navigate(['/home']);
    });
  }

  loadMessages(room: Room) {
    let url = CONFIG.serviceURL + "/messages/" + room._id;
    return this.http.get(url).subscribe((p: any[]) => {
      p = p.map(e => this.formatLoadedMessages(e));
      console.log(p);
      this.roomStore.dispatch(new RoomAction.LoadMessages({room: room, messages: p}));
      this.msg.next(undefined);
    });
  }

  joinSocketRoom(roomId: string, isInsert = false) {
    let type = MessageType.Message;
    if(isInsert) {
      type = MessageType.NewUser;
    }
    let socketObj = { user: { _id: this.user._id, nickname: this.user.nickname }, eventId: roomId, type, date: new Date(), text: '~'};
    this.socket.emit('joinRoom', roomId, socketObj);
  }

}
