import { Injectable, OnDestroy } from '@angular/core';
import { Room, RoomUser } from 'src/app/dtos/room';
import { Event } from 'src/app/dtos/event';
import { Store } from '@ngrx/store';
import * as fromRoom from './store/room.reducer';
import * as RoomAction from './store/room.actions';
import * as fromApp from '../../../store/app.reducer';
import * as AppAction from "../../../store/app.actions";

import { MMessage, MessageType } from 'src/app/dtos/message';
import * as io from 'socket.io-client';

import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/dtos/user';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { Subscription, Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { NotificationService, SnackType } from '../../notification/notification.service';
import { environment } from 'src/environments/environment';
import { tap, catchError, take, map } from 'rxjs/operators';
import { AlertService } from '../../alert/alert.service';
import { AppService } from 'src/app/app.service';
import cloneDeep from "lodash.clonedeep";


const MESSAGE_TO_CLIENT = 'messageToClient';
const JOIN_ROOM = 'joinRoom';
const LEAVE_ROOM = 'leaveRoom';
const KICK_PERSON = 'kickPerson';
const CANCEL_EVENT = 'cancelEvent';
const COMPLETE_EVENT = 'completeEvent';
const USER_ENTERED = 'userEntered';
const UPDATE_LAST_SEEN = 'updateLastSeen';

@Injectable({
  providedIn: "root",
})

export class RoomService implements OnDestroy {
  socket: SocketIOClient.Socket;
  rooms: Room[];
  activeRoom: Room;
  url: string;
  connectionOptions: any;
  user: User;
  subscription: Subscription;
  connected: boolean = false;

  unreadMessageCount: number = 0;

  routerRoomInfo: BehaviorSubject<Room> = new BehaviorSubject(undefined);

  constructor(
    private http: HttpClient,
    private store: Store<fromApp.AppState>,
    private roomStore: Store<fromRoom.State>,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private alertService: AlertService,
    private appService: AppService
  ) {
    this.subscription = new Subscription();
    this.store.select("roomState").subscribe((p) => {
      if (p) {
        this.activeRoom = p.activeRoom;
        this.rooms = p.rooms;
        this.calcUnreadMessages();
      }
    });

    this.store.select("authState").subscribe((p) => {
      this.user = p.user;

      if (this.user && !this.connected) {
        this.getRooms();
        this.socket = io(environment.serviceURL, {
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: Infinity,
        });
        this.socket.on('reconnect', (attempNumber) => {
          this.getRooms();
          this.setActiveRoomUndefined();
        });
        let getMessagesSubscription: Subscription;
        getMessagesSubscription = this.getMessages().subscribe(
          (message: string) => {},
          (e) => console.log(e)
        );
        this.subscription.add(getMessagesSubscription);
        this.connected = true;
      }
    });

    this.url = environment.serviceURL;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.connected = false;
  }

  getMessages() {
    return Observable.create((observer) => {
      if (this.socket) {
        this.socket.on(MESSAGE_TO_CLIENT, (message: Object) => {
          this.insertMessage(message, observer);
        });
        this.socket.on(JOIN_ROOM, (message: any) => {
          this.insertMessage(message, observer);
        });
        this.socket.on(LEAVE_ROOM, (message: any) => {
          this.processLeaveRoom(message, observer);
        });
        this.socket.on(KICK_PERSON,(message: { personToKick: string; roomToLeave: string }) => {
            if (message.personToKick === this.user._id)
              this.processKick(message.roomToLeave, message.personToKick);
          }
        );
        this.socket.on(CANCEL_EVENT, (message) => {
          this.processCancelEvent(message.message);
        });
        this.socket.on(COMPLETE_EVENT, (message) => {
          this.processCompleteEvent(message.message);
        })
      }
    });
  }

  private processLeaveRoom(message: any, observer: any) {
    this.insertMessage(message, observer);
    if (
      message["message"].type === MessageType.KickUser &&
      (message["message"] as MMessage).roomUser.user._id === this.user._id
    ) {
      let room = this.rooms.find(
        (r) => r._id === (message["message"] as MMessage).eventId
      );
      this.notificationService.notify(room.title + " Event'inden kovuldun.");
      this.roomStore.dispatch(new RoomAction.LeaveRoom({ room }));
      if (
        this.router.url ===
        "/room/" + (message["message"] as MMessage).eventId
      ) {
        this.router.navigate(["/home"]);
      }
    }
  }

  private insertMessage(message: Object, observer: any) {
    let incMessage = message["message"] as MMessage;
    let room = this.rooms.find((p) => p._id === incMessage.eventId);
    if (room) {

      if (incMessage.type === MessageType.NewUser) {
        this.roomStore.dispatch(new RoomAction.InsertUser({roomId: room._id, roomUser: message["message"].roomUser, }));
      } else if (incMessage.type === MessageType.LeaveRoom || incMessage.type === MessageType.KickUser) {
        this.roomStore.dispatch(new RoomAction.KickUser({room, roomUserId: message["message"].roomUser.user._id, }));
      } else {
        if (incMessage.roomUser.user._id !== this.user._id && room.messages) this.alertService.play();
        this.roomStore.dispatch(new RoomAction.SendMessage({ room: room, roomUser: { user: this.user }, message: [incMessage] }));
      }
      if (this.activeRoom && this.activeRoom._id === room._id && this.user._id !== incMessage.roomUser.user._id) {
        this.updateLastSeen(room._id);
      }
      observer.next(message);
    }
  }

  sendMessage(room: Room, message: MMessage) {
    this.socket.emit("message", message);
  }

  changeRoom(roomId: string) {
    if (this.rooms) {
      let room = this.rooms.find((r) => r._id === roomId);
      if(room) {
        this.userEntered(room._id);
        this.roomStore.dispatch(new RoomAction.ChangeActiveRoom({ roomId }));
        this.resetRoomUnreadCount(room);
        if (!room.users) {
          this.getRoomUsers(room).toPromise().then();
        }
        if(!room.messages) {
          this.loadMessages(room).pipe(take(1)).subscribe();
        }
      } else {
        this.router.navigate(["/home"]);
      }
    }
  }

  emptyActiveRoom() {
    this.roomStore.dispatch(
      new RoomAction.ChangeActiveRoom({ roomId: undefined })
    );
  }

  joinRoom(room: Room) {
    let url = environment.serviceURL + "/jUser/add";

    let postObj = {
      eventId: room._id,
      userId: this.user._id,
      joinDate: new Date(),
    };

    return this.http.post<any>(url, postObj).pipe(
      tap((p) => {
        if(p.code) {
          this.notificationService.notify(p.msg, SnackType.warn, 'OK');
          throw new Error(p.msg);
        }
        this.roomStore.dispatch(new RoomAction.JoinRoom({ room: p.obj }));
        if(!this.appService.smallScreen) this.changeRoom(room._id);
        this.joinSocketRoom(room._id, true);
        this.store.dispatch(new AppAction.FilterEvent(room));
      }),
      catchError(e => {
        return throwError(e);
      })
    );
  }

  getRooms() {
    let url = environment.serviceURL + "/jUser/getEvents/" + this.authService.user._id;
    this.http.get<any>(url).subscribe(
      (res) => {
        let rooms = res as Room[];
        this.roomStore.dispatch(new RoomAction.GetRooms({ rooms }));
        rooms.forEach((r) => {
          this.joinSocketRoom(r._id);
        });
      },
      (error) => {
        this.authService.logoutUser();
      }
    );
  }

  formatLoadedMessages(p: {
    _id: string;
    eventId: string;
    messageDate: string;
    text: string;
    userId: string;
    userName: string;
    type: number;
    user: User;
  }) {
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
    let url = environment.serviceURL + "/jUser/get/" + room._id;
    return this.http.get<RoomUser[]>(url).pipe(
      tap((p) => {
        this.roomStore.dispatch(new RoomAction.SetRoomUsers({ room: room, roomUsers: p }));
      })
    );
  }

  kickUser(eventId: string, user: { _id: string; nickname: string }) {
    let url = environment.serviceURL + "/jUser/kick";
    let postObj = { eventId, userId: user._id };
    this.http.post(url, postObj).subscribe((p) => {
      let room = this.rooms.find((p) => p._id === eventId);
      this.kickSocketRoom(eventId, user);
      this.notificationService.notify("userKicked");
    });
  }

  processKick(
    eventId: string,
    userId: string,
    type: MessageType = MessageType.KickUser
  ) {
    let url = environment.serviceURL + "/jUser/leave";
    let postObj = { eventId, userId };
    this.http.post(url, postObj).subscribe((p) => {
      this.leaveSocketRoom(eventId, type);
    });
  }

  leaveRoom(
    eventId: string,
    userId: string,
    type: MessageType = MessageType.LeaveRoom
  ) {
    let url = environment.serviceURL + "/jUser/leave";
    let postObj = { eventId, userId };
    this.http.post(url, postObj).subscribe((p) => {
      let room = this.rooms.find((p) => p._id === eventId);
      this.roomStore.dispatch(new RoomAction.LeaveRoom({ room }));
      this.leaveSocketRoom(eventId, type);
      this.router.navigate(["/home"]);
    });
  }

  loadMessages(room: Room, pageNo: number = 1) {
    let url = environment.serviceURL + "/messages/" + room._id;
    let messageSize = 20;
    let copyMessages = cloneDeep(room.messages);
    let slicedMessages;
    if (copyMessages) {
      let firstRange = copyMessages.length - (messageSize * pageNo);
      let secondRange = copyMessages.length - (pageNo - 1)*messageSize;

      if(secondRange > 0) {
        if(firstRange < 0) {
          firstRange = 0;
          slicedMessages = copyMessages.slice(firstRange, secondRange);
        } else {
          copyMessages.splice(secondRange);
          slicedMessages = copyMessages.slice(-messageSize);
        }
      }
      // slicedMessages = room.messages.slice((pageNo - 1) * messageSize, pageNo * messageSize);
    }
    //console.log(slicedMessages);
    if(slicedMessages && slicedMessages.length > 0) {
      return of(slicedMessages);
    } else {
      return this.http
        .get(url, {
          params: {
            pageNo: pageNo.toString(),
          },
        })
        .pipe(
          map((result: any) => {
            let res = result.map((e) => this.formatLoadedMessages(e));
            this.roomStore.dispatch(new RoomAction.LoadMessages({ room: room, messages: res }));
            return res;
          })
        );
    }
  }

  joinSocketRoom(roomId: string, isInsert = false) {
    let type: MessageType = undefined;
    if (isInsert) {
      type = MessageType.NewUser;
    }
    let socketObj: Partial<MMessage> = {
      roomUser: { user: { _id: this.user._id, nickname: this.user.nickname, imageURI: this.user.imageURI, userType: this.user.userType } },
      eventId: roomId,
      type,
      date: new Date(),
      message: "~!~",
    };
    this.socket.emit(JOIN_ROOM, roomId, socketObj);
  }

  leaveSocketRoom(roomId: string, type: MessageType) {
    let postUser = {
      user: { _id: this.user._id, nickname: this.user.nickname },
    };
    let socketObj: Partial<MMessage> = {
      roomUser: postUser,
      eventId: roomId,
      type,
      date: new Date(),
      message: "~!~",
    };
    this.socket.emit(LEAVE_ROOM, roomId, socketObj);
  }

  kickSocketRoom(roomId: string, user?: Partial<User>) {
    this.socket.emit(KICK_PERSON, user._id, roomId);
  }

  cancelEvent(roomId: string, isAuth: boolean = false) {
    this.socket.emit(CANCEL_EVENT, roomId, roomId);
    /** isAuthsa event içeride olmayan bir admin tarafından iptal edilmiş demek. */
    if (isAuth) {
      this.store.dispatch(new AppAction.FilterEvent({ _id: roomId }));
    }
  }

  completeEvent(roomId: string) {
    this.socket.emit(COMPLETE_EVENT, roomId, roomId);
  }

  processCancelEvent(roomId: string) {
    let room = this.rooms.find((p) => p._id === roomId);
    this.notificationService.notify(room.title + " iptal edildi.");
    this.roomStore.dispatch(new RoomAction.LeaveRoom({ room }));
    if (this.router.url === "/room/" + roomId) {
      this.router.navigate(["/home"]);
    }
  }

  processCompleteEvent(roomId: string) {
    let room = this.rooms.find((p) => p._id === roomId);
    this.notificationService.notify(room.title + " tamamlandı.");
    this.roomStore.dispatch(new RoomAction.LeaveRoom({ room }));
    let roomAsEvent: Room = JSON.parse(JSON.stringify(room));
    delete roomAsEvent.users;
    delete roomAsEvent.unreadMessagesCount;
    delete roomAsEvent.messages;
    this.store.dispatch(new AppAction.AddHistoryEvent( {...(roomAsEvent as Event)}))
    if (this.router.url === "/room/" + roomId) {
      this.router.navigate(["/home"]);
    }
  }

  calcUnreadMessages() {
    let calc = 0;
    this.rooms.forEach((r) => {
      if (r.unreadMessagesCount && r.unreadMessagesCount > 0)
        calc = calc + r.unreadMessagesCount;
    });
    this.unreadMessageCount = calc;
  }

  resetRoomUnreadCount(room: Room) {
    this.roomStore.dispatch(new RoomAction.ResetRoomUnreadCount({ room }));
  }

  userEntered(eventId: string) {
    this.socket.emit(UPDATE_LAST_SEEN, {eventId, userId: this.authService.user._id});
  }

  userExit(eventId: string) {
    this.socket.emit(UPDATE_LAST_SEEN, { eventId, userId: this.authService.user._id });
  }

  updateLastSeen(eventId: string) {
    this.socket.emit(UPDATE_LAST_SEEN, { eventId, userId: this.authService.user._id });
  }

  updateRoomInfo(room: Room) {
    let url = environment.serviceURL + "/event/update/"+room._id;
    let postObj = { ...room };
    return this.http.post(url, postObj).pipe(
      tap(p => {
        if(p["imageURI"]) room.imageURI = p["imageURI"];
        if(room.base64) room.base64 = undefined;
        this.roomStore.dispatch(new RoomAction.UpdateRoomInfo({ room }));
        this.notificationService.notify('roomUpdated', SnackType.default);
      })
    )
  }

  setActiveRoomUndefined() {
    this.store.dispatch(new RoomAction.SetActiveRoomUndefined());
  }

}
