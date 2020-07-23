import { Component, OnInit, NgZone, ViewChild, ElementRef, OnDestroy, ViewChildren, QueryList, ChangeDetectorRef } from '@angular/core';
import * as fromRoom from '../../../services/dataServices/room/store/room.reducer';
import * as fromAuth from '../../../services/auth/store/auth.reducer';
import * as fromApp from "../../../store/app.reducer";
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { RoomService } from 'src/app/services/dataServices/room/room.service';
import { ActivatedRoute } from '@angular/router';
import { MMessage } from 'src/app/dtos/message';
import { User } from 'src/app/dtos/user';
import { Room, RoomUser } from 'src/app/dtos/room';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription, Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EventInfoComponent } from '../../event-info/event-info.component';
import { Store } from '@ngrx/store';
import { AppService } from 'src/app/app.service';
import { ModalType } from 'src/app/components/generic-modal/generic-modal.component';
import { NotificationService, SnackType } from 'src/app/services/notification/notification.service';
import { environment } from 'src/environments/environment';
import { NewFeedbackComponent } from 'src/app/components/new-feedback/new-feedback.component';
import { FeedbackTypes, UserType } from 'src/app/dtos/enums';
import { take } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

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
  activeRoomMessages: MMessage[];
  activeRoomUsers: RoomUser[];

  rooms: Room[];
  user: User;
  subscription: Subscription;
  scroll: Boolean = true;

  roomId: string;
  routeSubscription: Subscription;

  previousScrollHeightMinusTop: number;

  isAllMessages = false;
  message: FormControl = new FormControl('');

  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  @ViewChild('messages') messages: ElementRef;
  @ViewChildren('messagesContainer') messagesContainer: QueryList<ElementRef>;

  height1: any;
  height2: any;

  constructor(
    private roomService: RoomService,
    private _ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private appService: AppService,
    private store: Store<fromApp.AppState>,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.pageNo = 1;

    this.user = this.authService.user;
    this.roomState = this.store.select('roomState');
    this.subscription = new Subscription();

    let routeSubscription = this.activatedRoute.paramMap.subscribe(p => {
      /** roomId varsa demek ki route ile gelmiş ve solo açılmış */
      this.roomId = p.get('id');
      if (this.roomId) {
        this.scroll = true;
        this.pageNo = 1;
        this.roomService.changeRoom(this.roomId);
      }

    });
    this.subscription.add(routeSubscription);
  }


  ngAfterViewInit() {
    let containerSub = this.messagesContainer.changes.subscribe((list: QueryList<ElementRef>) => {
      this.scrollToBottomCheck();
      if (this.scroll && list.length > 0) {
        this.scroll = false;
      }
    });
    this.subscription.add(containerSub);
    let stateSub = this.store.select("roomState").subscribe(p => {
      this._loading = false;
      if(!this.activeRoom || (p.activeRoom && p.activeRoom._id !== this.activeRoom._id) ) this.scroll = true;
      if ((this.activeRoom && p.activeRoom && p.activeRoom._id !== this.activeRoom._id)) { this.roomService.userExit(this.activeRoom._id); }
      if (p.rooms.length > 0) {
        if(p.activeRoom) this.activeRoom = p.activeRoom;
      }
      this.cdr.detectChanges();
    });
    this.subscription.add(stateSub);

    if (this.messages) {
      (this.messages.nativeElement as HTMLLIElement).addEventListener('scroll', () => {
        let scrollHeight = (this.messages.nativeElement as HTMLLIElement).scrollHeight;
        let scrollTop = (this.messages.nativeElement as HTMLLIElement).scrollTop;

        this.height1 = (this.messages.nativeElement.scrollHeight - this.messages.nativeElement.offsetHeight);
        this.height2 = this.messages.nativeElement.scrollTop;

        if(scrollHeight > 0 && scrollTop === 0 && !this.isAllMessages) {
          this.pageNo++;
          this._loading = true;
          this.previousScrollHeightMinusTop = scrollHeight - scrollTop;
          let loadSub = this.roomService.loadMessages(this.activeRoom, this.pageNo).subscribe(r => {
            if(r.length === 0) {
              this.isAllMessages = true;
            }
          });
          this.subscription.add(loadSub);
        }
      });
    }
  }

  loadMoreWithButton() {
    this._loading = true;
    let loadSub = this.roomService.bugloadMessages(this.activeRoom, this.pageNo).subscribe(r => {
      if (r.length === 0) {
        this.isAllMessages = true;
      }
    });
    this.subscription.add(loadSub);
  }

  ngOnDestroy() {
    if(this.activeRoom) this.roomService.userExit(this.activeRoom._id);
    this.roomService.setActiveRoomUndefined();
    this.subscription.unsubscribe();
  }

  triggerResize() {
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  sendMessage() {
    // let value: string = (event.target as HTMLInputElement).value;
    let value = this.message.value;
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
    // (event.target as HTMLInputElement).value = '';
    this.message.setValue('');
  }

  scrollToBottomCheck() {
    if(!this.scroll) {
      if (this.height1 - this.height2  < 300) {
        this.scrollToBottom();
      }
    } else {
      this.scrollToBottom();
    }
  }

  scrollToBottom() {
    if(this.messages) {
      setTimeout(()=>{
        this.messages.nativeElement.scrollTop = this.messages.nativeElement.scrollHeight
      });
    }
  }

  isOwn(message: MMessage) {
    return message.roomUser.user._id === this.user._id;
  }

  textareaFocus() {
    if(this.isSmallScreen) {
      setTimeout(() => {
        this.scrollToBottom()
      }, 1000);
    }
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

  isLineAdmin(user: User) {
    return user.userType === UserType.Admin;
  }

  isKickable(user: User) {
    return user._id !== this.authService.user._id && user.userType !== UserType.Admin;
  }

  leaveRoom() {
    this.appService.openModal(undefined, 'leaveQuestion', undefined, ModalType.Confirmation).subscribe(p => {
      if (p) this.roomService.leaveRoom(this.activeRoom._id, this.user._id);
    });
  }

  cancelEvent() {
    this.appService.openModal(undefined, 'cancelQuestion', undefined, ModalType.Confirmation).subscribe(p => {
      if (p) this.roomService.cancelEvent(this.activeRoom._id);
    });
  }

  completeEvent() {
    this.appService.openModal(undefined, 'completeQuestion', undefined, ModalType.Confirmation).subscribe(p => {
      if (p) this.roomService.completeEvent(this.activeRoom._id);
    });
  }

  getColor(user: User) {
    if(this.activeRoom.users && user && user._id) {
      let userCurrent = this.activeRoom.users.find(u => u.user._id === user._id);
      if (userCurrent) {
        let color = userCurrent.color;
        if(color) return 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')';
      }
      else return 'rgba(145,145,145,1)';
    }
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

  get isSmallScreen() {
    return this.appService.smallScreen;
  }

  fallbackCopyTextToClipboard(text: string) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      if(successful) this.notificationService.notify('roomLinkCopied', SnackType.default, 'OK');
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  }


  copyTextToClipboard() {
    let text = environment.URL + '/ventiee/' + this.roomService.activeRoom._id;
    if (!navigator.clipboard) {
      this.fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      this.notificationService.notify('roomLinkCopied', SnackType.default);
    }, (err) => {
      console.error('Async: Could not copy text: ', err);
    });
  }

  report(user?: User) {
    let data = {
      event: this.activeRoom,
      type: FeedbackTypes.report,
      ownerUser: this.user
    }
    if(user) data["user"] = user;
    const dialogRef = this.dialog.open(NewFeedbackComponent, {
      minWidth: '250px',
      maxWidth: '600px',
      data
    });
    dialogRef.afterClosed().subscribe(result => { });
    /** To report! */
  }


}
