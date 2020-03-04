import { Component, OnInit, Input } from '@angular/core';
import { Room } from 'src/app/dtos/room';
import { RoomService } from 'src/app/services/dataServices/room/room.service';

@Component({
  selector: 'chat-rooms',
  templateUrl: './chat-rooms.component.html',
  styleUrls: ['./chat-rooms.component.scss']
})
export class ChatRoomsComponent implements OnInit {

  @Input() room: Room;

  constructor(private roomService: RoomService) { }

  ngOnInit(): void { }

  log(id) {
    this.roomService.getMessages(this.room);
  }

}
