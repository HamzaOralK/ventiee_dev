import { Component, OnInit, Input } from '@angular/core';
import { Event } from 'src/app/dtos/event';
import { Room } from 'src/app/dtos/room';
import { RoomService } from 'src/app/services/dataServices/room/room.service';

@Component({
  selector: 'event-line',
  templateUrl: './event-line.component.html',
  styleUrls: ['./event-line.component.scss']
})

export class EventLineComponent implements OnInit {

  @Input() event: Event;

  constructor(
    private roomService: RoomService
  ) { }

  ngOnInit(): void { }

  joinEvent() {
    let userNewRoom = new Room();
    userNewRoom._id = this.event._id;
    this.roomService.joinRoom(userNewRoom);
  }
}
