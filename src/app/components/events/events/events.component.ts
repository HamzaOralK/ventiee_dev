import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit {

  @Input() events: Event[];

  constructor() { }

  ngOnInit(): void { }

}
