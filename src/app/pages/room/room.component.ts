import { Component, OnInit, NgZone, ViewChild, ElementRef, AfterViewChecked, OnChanges, SimpleChanges, OnDestroy, AfterViewInit, ChangeDetectorRef, ViewChildren, QueryList } from '@angular/core';
import * as fromRoom from '../../services/dataServices/room/store/room.reducer';
import * as fromAuth from '../../services/auth/store/auth.reducer';
import * as fromApp from "../../store/app.reducer";
import { Observable } from 'rxjs/internal/Observable';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/internal/operators/take';
import { RoomService } from 'src/app/services/dataServices/room/room.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MMessage } from 'src/app/dtos/message';
import { COMMONS } from 'src/app/shared/commons';
import { User, Color } from 'src/app/dtos/user';
import { Room } from 'src/app/dtos/room';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EventInfoComponent } from '../event-info/event-info.component';
import { Store } from '@ngrx/store';

@Component({
  selector: 'room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  roomState: Observable<fromRoom.State>;
  authState: Observable<fromAuth.State>;

  activeRoom: Room;

  rooms: Room[];
  user: User;
  subscription: Subscription;
  scroll: Boolean = true;

  roomId: string;
  routeSubscription: Subscription;

  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  @ViewChild('messages') messages: ElementRef;
  @ViewChildren("messagesContainer") messagesContainer: QueryList<ElementRef>;


  constructor(
    private roomService: RoomService,
    private _ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private store: Store<fromApp.AppState>,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.user = this.authService.user;
    this.roomState = this.store.select('roomState');
    this.subscription = new Subscription();

    let routeSubscription = this.activatedRoute.paramMap.subscribe(p => {
      this.roomService.changeRoom(p.get('id'));
      this.scroll = true;
    });
    this.subscription.add(routeSubscription);

    let stateSub = this.roomState.subscribe(p => {
      this.activeRoom = p.activeRoom;
      console.log(this.activeRoom);
      if(this.activeRoom) {
        if(this.activeRoom.users && this.activeRoom.users.length >= 1) {
          this.activeRoom.users.map(user => {
            if(!user.color) {
              let color = new Color(this.getRandom(255), this.getRandom(255), this.getRandom(255), 1);
              user.color = color
            }
            return user;
          });
        }
      }
      else this.router.navigate(['/home']);
    });
    this.subscription.add(stateSub);

    let msgSubscription = this.roomService.msg.subscribe(p => { });
    this.subscription.add(msgSubscription);
  }


  ngAfterViewInit() {
    this.scrollToBottom();
    this.messagesContainer.changes.subscribe((list: QueryList<ElementRef>) => {
      this.scrollToBottomCheck();
      this.scroll = false;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  triggerResize() {
    this._ngZone.onStable.pipe(take(1)).subscribe(() => this.autosize.resizeToFitContent(true));
  }

  sendMessage(event: InputEvent) {
    let value = (event.target as HTMLInputElement).value;
    if(value) {
      let message = new MMessage();
      message._id = COMMONS.generateUUID();
      message.date = new Date();
      message.message = value;
      message.user = this.user;
      message.eventId = this.activeRoom._id;
      message.isRead = false;
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
  }

  isOwn(message: MMessage) {
    return message.user._id === this.user._id;
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
    this.roomService.kickUser(this.activeRoom._id, user._id);
  }

  isModerator(user: User) {
    return user._id === this.authService.user._id;
  }

  isKickable(user) {
    return user._id !== this.authService.user._id;
  }

  getRandom(number: number) {
    return Math.floor(Math.random() * number);
  }

  getColor(user: User) {
    if(this.activeRoom.users && user && user._id) {
      let userCurrent = this.activeRoom.users.find(u => u._id === user._id);
      if (userCurrent) {
        let color = userCurrent.color;
        return 'rgba(' + color.r + ',' + color.g + ',' + color.b + ',' + color.a + ')';
      }
      else return 'rgba(145,145,145,1)';
    }
  }


}
