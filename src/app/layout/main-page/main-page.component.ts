import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RoomService } from 'src/app/services/dataServices/room/room.service';

@Component({
  selector: 'main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainPageComponent implements OnInit {

  constructor(private roomService: RoomService) { }

  ngOnInit() { }

}
