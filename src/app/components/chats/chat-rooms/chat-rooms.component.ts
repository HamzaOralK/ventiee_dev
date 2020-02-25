import { Component, OnInit, Input } from '@angular/core';
import { Room } from 'src/app/dtos/room';

@Component({
  selector: 'chat-rooms',
  templateUrl: './chat-rooms.component.html',
  styleUrls: ['./chat-rooms.component.scss']
})
export class ChatRoomsComponent implements OnInit {

  @Input() room: Room;

  constructor() { }

  ngOnInit(): void { }

}
