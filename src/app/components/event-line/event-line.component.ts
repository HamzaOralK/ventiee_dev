import { Component, OnInit, Input } from '@angular/core';
import { Event } from 'src/app/dtos/event';
import { Room } from 'src/app/dtos/room';
import { COMMONS } from 'src/app/shared/commons';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RoomService } from 'src/app/services/dataServices/room/room.service';
import { Router } from '@angular/router';

@Component({
  selector: 'event-line',
  templateUrl: './event-line.component.html',
  styleUrls: ['./event-line.component.scss']
})

export class EventLineComponent implements OnInit {

  @Input() event: Event;

  constructor(
    private authService: AuthService,
    private roomService: RoomService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  joinEvent() {
    let userNewRoom = new Room();;
    userNewRoom.eventId = this.event._id;
    userNewRoom._id = this.event._id;
    userNewRoom.users = [];
    userNewRoom.messages = [];
    userNewRoom.title = this.event.title;
    userNewRoom.users.push(this.authService.user);
    this.roomService.joinRoom(userNewRoom);
    this.router.navigate(['/room/' + userNewRoom._id]);
  }
}
