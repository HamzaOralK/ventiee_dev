import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Event } from 'src/app/dtos/event';
import { Room } from 'src/app/dtos/room';
import { RoomService } from 'src/app/services/dataServices/room/room.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/dtos/user';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';
import { UserType, FeedbackTypes } from 'src/app/dtos/enums';
import { ModalType } from '../../generic-modal/generic-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { NewFeedbackComponent } from '../../new-feedback/new-feedback.component';
import * as fromApp from "../../../store/app.reducer";
import { Store } from '@ngrx/store';


@Component({
  selector: 'event-line',
  templateUrl: './event-line.component.html',
  styleUrls: ['./event-line.component.scss']
})

export class EventLineComponent implements OnInit {
  @Output("onJoin") onJoin = new EventEmitter();

  @Input() type: string;
  @Input() event: Event;
  smallScreen: boolean;

  user: User;
  constructor(
    private roomService: RoomService,
    private authService: AuthService,
    private appService: AppService,
    private router: Router,
    public dialog: MatDialog,
    private store: Store<fromApp.AppState>,

  ) { }

  ngOnInit(): void {
    this.appService.s_smallScreen.subscribe(p => {
      this.smallScreen = p;
    });
    this.user = this.authService.user;
  }

  joinEvent() {
    let userNewRoom = new Room();
    userNewRoom._id = this.event._id;
    this.roomService.joinRoom(userNewRoom).subscribe(p => {
      // this.roomService.changeRoom(this.event._id);
      // this.store.dispatch(new AppAction.FilterEvent(this.event));
      if(this.appService.smallScreen) {
        this.router.navigate(['/room/' + this.event._id]);
      } else {
        this.onJoin.emit(this.event);
      }
    });
  }

  checkJoinable() {
    return this.user._id !== this.event.moderatorUserId;
  }

  setHeight() {
    return this.smallScreen ? '150px' : '130px';
  }

  removeByAdminAuth(eventId: string) {
    this.appService.openModal(this.event.title, 'deleteQuestion', undefined, ModalType.Confirmation).subscribe(p => {
      if (p) this.roomService.cancelEvent(eventId, true);
    })
  }

  checkAdmin() {
    return this.user.userType === UserType.Admin;
  }

  report() {
    /*
    this.appService.openModal(this.event.title, 'reportQuestion', undefined, ModalType.Confirmation).subscribe(p => {
      if(p) console.log('Şikayet ediltdi.');
    });
    */
    const dialogRef = this.dialog.open(NewFeedbackComponent, {
      minWidth: '250px',
      maxWidth: '600px',
      data: {
        event: this.event,
        type: FeedbackTypes.report,
        ownerUser: this.user
      }
    });
    dialogRef.afterClosed().subscribe(result => { });
  }
}
