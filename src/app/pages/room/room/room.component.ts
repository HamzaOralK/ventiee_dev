import { Component, OnInit, NgZone, ViewChild, ElementRef, OnDestroy, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import * as fromRoom from '../../../services/dataServices/room/store/room.reducer';
import * as fromAuth from '../../../services/auth/store/auth.reducer';
import * as fromApp from "../../../store/app.reducer";
import { Observable } from 'rxjs/internal/Observable';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/internal/operators/take';
import { RoomService } from 'src/app/services/dataServices/room/room.service';
import { ActivatedRoute } from '@angular/router';
import { MMessage, MessageType } from 'src/app/dtos/message';
import { User } from 'src/app/dtos/user';
import { Room, RoomUser, Color } from 'src/app/dtos/room';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EventInfoComponent } from '../../event-info/event-info.component';
import { Store } from '@ngrx/store';

@Component({
  selector: 'room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  _loading: boolean = false;

  pageNo: number;

  roomState: Observable<fromRoom.State>;
  authState: Observable<fromAuth.State>;

  activeRoom: Room;

  rooms: Room[];
  user: User;
  subscription: Subscription;
  scroll: Boolean = true;

  roomId: string;
  routeSubscription: Subscription;

  previousScrollHeightMinusTop: number;

  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  @ViewChild('messages') messages: ElementRef;
  @ViewChildren('messagesContainer') messagesContainer: QueryList<ElementRef>;
  @ViewChild('scrollElement') scrollElement: ElementRef;

  constructor(
    private roomService: RoomService,
    private _ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private store: Store<fromApp.AppState>,
    public dialog: MatDialog,
    public cdr: ChangeDetectorRef

  ) { }

  ngOnInit(): void {
    this.pageNo = 1;

    this.user = this.authService.user;
    this.roomState = this.store.select('roomState');
    this.subscription = new Subscription();

    let routeSubscription = this.activatedRoute.paramMap.subscribe(p => {
      this.pageNo = 1;
      this.roomId = p.get('id');
      this.roomService.changeRoom(this.roomId);
      this.scroll = true;
      this.scrollToBottom();
    });
    this.subscription.add(routeSubscription);

    let msgSubscription = this.roomService.msg.subscribe(p => {
      let scrollHeight: number;
      setTimeout(() => {
        scrollHeight = (this.messages.nativeElement as HTMLLIElement).scrollHeight;
      });
      if (this.messages && this._loading)
        setTimeout(() => {
          (this.messages.nativeElement as HTMLLIElement).scrollTop = scrollHeight - this.previousScrollHeightMinusTop;
        });
      this._loading = false;
    });
    this.subscription.add(msgSubscription);
  }


  ngAfterViewInit() {
    let containerSub = this.messagesContainer.changes.subscribe(
      (list: QueryList<ElementRef>) => {
        this.scrollToBottomCheck();
        if (this.scroll && list.length > 0) {
          this.scroll = false;
        }
      }
    );
    this.subscription.add(containerSub);

    let stateSub = this.store.select("roomState").subscribe(p => {
      if (p.rooms.length > 0) {
        if ((!this.activeRoom || this.activeRoom._id !== p.activeRoom._id) && !p.activeRoom) {
          this.roomService.changeRoom(this.roomId);
        }
        else if (p.activeRoom) {
          this.activeRoom = p.activeRoom;
          if (this.activeRoom.users && this.activeRoom.users.length >= 1) {
            this.activeRoom.users.map(ru => {
              if (!ru.color) {
                ru.color = new Color(this.getRandom(255), this.getRandom(255), this.getRandom(255), 1);
              }
              return ru.user;
            });
          }
        }
      }
      this.cdr.detectChanges();
    });
    this.subscription.add(stateSub);



    if (this.messages) {
      (this.messages.nativeElement as HTMLLIElement).addEventListener('scroll', () => {
        let scrollHeight = (this.messages.nativeElement as HTMLLIElement).scrollHeight;
        let scrollTop = (this.messages.nativeElement as HTMLLIElement).scrollTop;
        if(scrollHeight > 0 && scrollTop === 0 ) {
          this.pageNo++;
          this._loading = true;
          this.previousScrollHeightMinusTop = scrollHeight - scrollTop;
          this.roomService.loadMessages(this.activeRoom, this.pageNo);
        }
      });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  triggerResize() {
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  sendMessage(event: Partial<InputEvent>) {
    let value: string = (event.target as HTMLInputElement).value;

    if(value.trim().length > 0) {
      let message = new MMessage();
      message.date = new Date();
      message.message = value;
      message.roomUser = new RoomUser();
      message.roomUser.user = this.user;
      message.eventId = this.activeRoom._id;
      message.isRead = false;
      message.type = undefined;
      this.roomService.sendMessage(this.activeRoom, message);
    };
    (event.target as HTMLInputElement).value = '';
  }

  scrollToBottomCheck() {
    if(!this.scroll) {
      if ((this.messages.nativeElement.scrollHeight - this.messages.nativeElement.offsetHeight) - this.messages.nativeElement.scrollTop < 300) {
        this.scrollToBottom();
      }
    } else {
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    if(this.messages) this.messages.nativeElement.scrollTop = this.messages.nativeElement.scrollHeight;
  }

  submit(event) {
    event.preventDefault();
    let dumEvent = { target: event.target[0] }
    this.sendMessage(dumEvent);
  }

  isOwn(message: MMessage) {
    return message.roomUser.user._id === this.user._id;
  }

  textareaFocus() {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(EventInfoComponent, {
      data: { room: this.activeRoom }
    });
    dialogRef.afterClosed().subscribe(result => { });
  }

  onKickUser(user: User) {
    this.roomService.kickUser(this.activeRoom._id, {_id: user._id, nickname: user.nickname});
  }

  isModerator() {
    return this.user._id === this.activeRoom.moderatorUser._id;
  }

  isLineModerator(user: User) {
    return user._id === this.activeRoom.moderatorUser._id;
  }

  isKickable(user) {
    return user._id !== this.authService.user._id;
  }

  getRandom(number: number) {
    return Math.floor(Math.random() * number);
  }

  getColor(user: User) {
    if(this.activeRoom.users && user && user._id) {
      let userCurrent = this.activeRoom.users.find(u => u.user._id === user._id);
      if (userCurrent) {
        let color = userCurrent.color;
        return 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')';
      }
      else return 'rgba(145,145,145,1)';
    }
  }

  leaveRoom() {
    this.roomService.leaveRoom(this.activeRoom._id, this.user._id);
  }

  getOnlyDate(date: Date): string {
    if(!(date instanceof Date)) {
      date = new Date(date);
    }

    var d = date.getDate().toString();
    var m = (date.getMonth() + 1).toString(); // Since getMonth() returns month from 0-11 not 1-12
    var y = date.getFullYear().toString();
    return d+"/"+m+"/"+y;
  }

}
