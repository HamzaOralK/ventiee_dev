import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Event } from 'src/app/dtos/event';
import { Room } from 'src/app/dtos/room';
import { RoomService } from 'src/app/services/dataServices/room/room.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/dtos/user';
import { AppService } from 'src/app/app.service';
import { Router } from '@angular/router';

@Component({
  selector: 'event-line',
  templateUrl: './event-line.component.html',
  styleUrls: ['./event-line.component.scss']
})

export class EventLineComponent implements OnInit {
  @Output("onJoin") onJoin = new EventEmitter();

  @Input() event: Event;
  smallScreen: boolean;

  user: User;
  constructor(
    private roomService: RoomService,
    private authService: AuthService,
    private appService: AppService,
    private router: Router
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
      if(this.appService.smallScreen) {
        this.roomService.changeRoom(this.event._id);
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
    return this.smallScreen ? '150px' : '110px';
  }
  removeByAdminAuth() {
    console.log(this.user);
  }

  checkAdmin() {
    return this.user.nickname === 'okhuz';
  }
}
