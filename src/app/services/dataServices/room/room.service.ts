import { Injectable, OnDestroy } from '@angular/core';
import { Room, RoomUser } from 'src/app/dtos/room';
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
      if(p) {
        this.activeRoom = p.activeRoom;
        this.rooms = p.rooms;
      }
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
        });
        this.socket.on('leaveRoom', (message: any) => {
          this.processLeaveRoom(message, observer);
        });
        this.socket.on('kickPerson', (message: {personToKick: string, roomToLeave: string}) => {
          if (message.personToKick === this.user._id) this.processKick(message.roomToLeave, message.personToKick);
        });
      }
    });
  }

  private processLeaveRoom(message: any, observer: any) {
    this.insertMessage(message, observer);
    if (message["message"].type === MessageType.KickUser && (message["message"] as MMessage).roomUser.user._id === this.user._id) {
      let room = this.rooms.find(r => r._id === (message["message"] as MMessage).eventId);
      this.notificationService.notify(room.title + " Event'inden kovuldun.");
      this.roomStore.dispatch(new RoomAction.LeaveRoom({ room }));
      if (this.router.url === '/room/' + (message["message"] as MMessage).eventId) {
        this.router.navigate(["/home"]);
      }
    }
  }

  private insertMessage(message: Object, observer: any) {
    let incMessage = message['message'] as MMessage;
    let room = this.rooms.find(p => p._id === incMessage.eventId);
    if(room) {
      this.roomStore.dispatch(new RoomAction.SendMessage({ room: room, roomUser: {user: this.user}, message: [incMessage] }));
      if (incMessage.type === MessageType.NewUser) {
        this.roomStore.dispatch(new RoomAction.InsertUser({ roomId: room._id, roomUser: message["message"].roomUser }));
      } else if (incMessage.type === MessageType.LeaveRoom || incMessage.type === MessageType.KickUser) {
        this.roomStore.dispatch(new RoomAction.KickUser({ room, roomUserId: message["message"].roomUser.user._id }));
      }
      observer.next(message);
      this.msg.next(message as MMessage);
    }
  }

  sendMessage(room: Room, message: MMessage) {
    this.socket.emit('message', message);
  }

  changeRoom(roomId: string) {
    this.roomStore.dispatch(new RoomAction.ChangeActiveRoom({roomId}));
    if(this.rooms) {
      let room = this.rooms.find(r => r._id === roomId);
      if(room && !room.users) {
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

  formatLoadedMessages(p: {_id: string, eventId: string, messageDate: string, text: string, userId: string, userName: string, type: number, user: User}) {
    let m = new MMessage();
    m._id = p._id;
    m.eventId = p.eventId;
    m.date = new Date(p.messageDate);
    m.message = p.text;
    m.roomUser = new RoomUser();
    m.roomUser.user = new User();
    m.roomUser.user = p.user;
    m.type = p.type;
    return m;
  }

  getRoomUsers(room: Room) {
    let url = CONFIG.serviceURL + "/jUser/get/" + room._id;
    this.http.get<RoomUser[]>(url).subscribe(p => {
      this.roomStore.dispatch(new RoomAction.SetRoomUsers({room: room, roomUsers: p}))
    });
  }

  kickUser(eventId: string, user: {_id: string, nickname: string}) {
    let url = CONFIG.serviceURL + "/jUser/kick";
    let sendObj = {eventId, userId: user._id}
    this.http.post(url, sendObj).subscribe(p => {
      let room = this.rooms.find(p => p._id === eventId);
      this.kickSocketRoom(eventId, user);
      this.notificationService.notify(this.mlPipe.transform('userKicked'));
    });
  }

  processKick(eventId: string, userId: string, type: MessageType = MessageType.KickUser) {
    let url = CONFIG.serviceURL + "/jUser/leave";
    let sendObj = { eventId, userId }
    this.http.post(url, sendObj).subscribe(p => {
      this.leaveSocketRoom(eventId, type);
    });
  }

  leaveRoom(eventId: string, userId: string, type: MessageType = MessageType.LeaveRoom) {
    let url = CONFIG.serviceURL + "/jUser/leave";
    let sendObj = { eventId, userId }
    this.http.post(url, sendObj).subscribe(p => {
      let room = this.rooms.find(p => p._id === eventId);
      this.roomStore.dispatch(new RoomAction.LeaveRoom({ room }));
      this.leaveSocketRoom(eventId, type);
      this.router.navigate(['/home']);
    });
  }

  loadMessages(room: Room, pageNo: number = 1) {
    let url = CONFIG.serviceURL + "/messages/" + room._id;
    return this.http.get(url, {params: {
      pageNo: pageNo.toString()
    }}).subscribe((p: any[]) => {
      p = p.map(e => this.formatLoadedMessages(e));
      this.roomStore.dispatch(new RoomAction.LoadMessages({room: room, messages: p}));
      this.msg.next(undefined);
    });
  }
  // messages/: id ? pageNo = 1

  joinSocketRoom(roomId: string, isInsert = false) {
    let type: MessageType = undefined;
    if(isInsert) {
      type = MessageType.NewUser;
    }
    let socketObj: Partial<MMessage> = {
      roomUser: { user: { _id: this.user._id, nickname: this.user.nickname } },
      eventId: roomId,
      type,
      date: new Date(),
      message: '~!~'
    };
    this.socket.emit('joinRoom', roomId, socketObj);
  }

  leaveSocketRoom(roomId: string, type: MessageType) {
    let postUser = { user: { _id: this.user._id, nickname: this.user.nickname }};
    let socketObj: Partial<MMessage> = {
      roomUser: postUser,
      eventId: roomId,
      type,
      date: new Date(),
      message: '~!~'
    };
    this.socket.emit('leaveRoom', roomId, socketObj);
  }

  kickSocketRoom(roomId: string, user?: Partial<User>) {
    this.socket.emit('kickPerson', user._id, roomId);
  }

}
