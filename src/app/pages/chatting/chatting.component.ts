import { Component, OnInit, NgZone, ViewChild, ChangeDetectorRef, ElementRef } from '@angular/core';
import * as fromRoom from '../../services/dataServices/room/store/room.reducer';
import * as fromApp from '../../store/app.reducer';
import * as fromAuth from '../../services/auth/store/auth.reducer';
import { Observable } from 'rxjs/internal/Observable';
import { Store } from '@ngrx/store';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/internal/operators/take';
import { RoomService } from 'src/app/services/dataServices/room/room.service';
import { ActivatedRoute } from '@angular/router';
import { MMessage } from 'src/app/dtos/message';
import { COMMONS } from 'src/app/shared/commons';
import { User } from 'src/app/dtos/user';
import { Room } from 'src/app/dtos/room';

@Component({
  selector: 'chatting',
  templateUrl: './chatting.component.html',
  styleUrls: ['./chatting.component.scss']
})
export class ChattingComponent implements OnInit {

  roomState: Observable<fromRoom.State>;
  authState: Observable<fromAuth.State>;
  activeRoom: Room;
  user: User;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  @ViewChild('messages') messages: ElementRef;

  constructor(
    private store: Store<fromApp.AppState>,
    private roomService: RoomService,
    private _ngZone: NgZone,
    private router: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.roomState = this.store.select('roomState');
    this.authState = this.store.select('authState');
    this.router.paramMap.subscribe(p => this.roomService.changeRoom(p.get('id')));
    this.roomState.subscribe(p => {
      this.activeRoom = p.activeRoom;
    });
    this.authState.subscribe(p => this.user = p.user);
  }

  ngAfterViewChecked() {        
    this.scrollToBottom();        
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
      message.room = this.activeRoom;
      this.roomService.sendMessage(this.activeRoom, message);
    };
    (event.target as HTMLInputElement).value = '';
  }

  scrollToBottom() {
    this.messages.nativeElement.scrollTop = this.messages.nativeElement.scrollHeight;
  }


  prevent(event: InputEvent) {
    event.preventDefault();
  }

  isOwn(message: MMessage) {
    return message.user === this.user;
  }

}