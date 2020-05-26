import { Component, OnInit, Input } from '@angular/core';
import { Room } from 'src/app/dtos/room';
import { AppService } from 'src/app/app.service';
import { RoomService } from 'src/app/services/dataServices/room/room.service';
import { Router } from '@angular/router';

@Component({
  selector: 'chat-rooms',
  templateUrl: './chat-rooms.component.html',
  styleUrls: ['./chat-rooms.component.scss']
})
export class ChatRoomsComponent implements OnInit {

  @Input() room: Room;

  constructor(
    private appService: AppService,
    private roomService: RoomService,
    private router: Router
  ) { }

  ngOnInit(): void { }



  changeRoom() {
    this.roomService.changeRoom(this.room._id);
    if(this.appService.smallScreen) {
      this.router.navigate(['/room/' + this.room._id]);
    }
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

  isSelected() {
    if (!this.appService.smallScreen && this.roomService.activeRoom) {
      return this.roomService.activeRoom._id === this.room._id;
    } else {
      return false;
    }
  }

}
