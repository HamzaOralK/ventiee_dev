import { Component, OnInit, NgZone, ViewChild, ElementRef, AfterViewChecked, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import * as fromRoom from '../../services/dataServices/room/store/room.reducer';
import * as fromAuth from '../../services/auth/store/auth.reducer';
import { Observable } from 'rxjs/internal/Observable';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/internal/operators/take';
import { RoomService } from 'src/app/services/dataServices/room/room.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MMessage } from 'src/app/dtos/message';
import { COMMONS } from 'src/app/shared/commons';
import { User } from 'src/app/dtos/user';
import { Room } from 'src/app/dtos/room';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EventInfoComponent } from '../event-info/event-info.component';

@Component({
  selector: 'chatting',
  templateUrl: './chatting.component.html',
  styleUrls: ['./chatting.component.scss']
})
export class ChattingComponent implements OnInit, AfterViewChecked, OnDestroy {

  roomState: Observable<fromRoom.State>;
  authState: Observable<fromAuth.State>;
  activeRoom: Room;
  user: User;
  subscription: Subscription;

  scroll: Boolean = true;

  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  @ViewChild('messages') messages: ElementRef;

  constructor(
    private roomService: RoomService,
    private _ngZone: NgZone,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.subscription = new Subscription();
    this.activatedRoute.paramMap.subscribe(p => this.roomService.changeRoom(p.get('id')));
    this.user = this.authService.user;
    this.activeRoom = this.roomService.activeRoom;
    /** For test purposes */
    if(this.activeRoom === undefined) {
      this.router.navigate(['/home'])
    }
    let msgSubscription = this.roomService.msg.subscribe(p => {
      this.scroll = true;
    });
    this.subscription.add(msgSubscription);
  }

  ngAfterViewChecked() {
    if(this.scroll){
      this.scrollToBottom();
      this.scroll = false;
    }
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

  scrollToBottom() {
    if ((this.messages.nativeElement.scrollHeight - this.messages.nativeElement.offsetHeight) - this.messages.nativeElement.scrollTop < 300) {
      this.messages.nativeElement.scrollTop = this.messages.nativeElement.scrollHeight;
    }
  }

  submit(event) {
    event.preventDefault();
  }

  isOwn(message: MMessage) {
    return message.user.email === this.user.email;
  }

  textareaFocus() {
    window.scrollTo(0, 0);
    document.body.scrollTop = 0;
  }

  openDialog(): void {

    const dialogRef = this.dialog.open(EventInfoComponent, {
      data: { room: this.activeRoom }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

}
