import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Room } from 'src/app/dtos/room';

@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {
  @Output('onJoinEvent') onJoinEvent = new EventEmitter();
  @Input() events: Event[];


  constructor() { }

  ngOnInit(): void { }

  onJoin($event) {
    this.onJoinEvent.emit($event);
  }

}
