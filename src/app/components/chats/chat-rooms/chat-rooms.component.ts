import { Component, OnInit, Input } from '@angular/core';
import { Room } from 'src/app/dtos/room';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'chat-rooms',
  templateUrl: './chat-rooms.component.html',
  styleUrls: ['./chat-rooms.component.scss']
})
export class ChatRoomsComponent implements OnInit {

  @Input() room: Room;

  constructor(
    private appService: AppService
  ) { }

  ngOnInit(): void { }

  onCloseNav() {
    this.appService.closeNav();
  }

  getLastMessage() {
    if (this.room.messages && this.room.messages[this.room.messages.length - 1]) return this.room.messages[this.room.messages.length-1].message;
    else return '';
  }

  getLastMessageUser() {
    if (this.room.messages && this.room.messages[this.room.messages.length - 1]) {
      if (this.room.messages[this.room.messages.length - 1].roomUser.user.nickname)
        return this.room.messages[this.room.messages.length - 1].roomUser.user.nickname
      else return this.room.messages[this.room.messages.length - 1].roomUser.user.name
    } else {
      return '';
    };
  }

}
