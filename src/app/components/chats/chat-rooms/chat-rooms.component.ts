import { Component, OnInit, Input } from '@angular/core';
import { Room } from 'src/app/dtos/room';
import { RoomService } from 'src/app/services/dataServices/room/room.service';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'chat-rooms',
  templateUrl: './chat-rooms.component.html',
  styleUrls: ['./chat-rooms.component.scss']
})
export class ChatRoomsComponent implements OnInit {

  @Input() room: Room;

  constructor(
    private roomService: RoomService,
    private appService: AppService
  ) { }

  ngOnInit(): void { }

  onCloseNav() {
    this.appService.closeNav();
  }

}
