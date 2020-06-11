import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/dataServices/event/event-service.service';
import { EventStatus } from 'src/app/dtos/event';

@Component({
  selector: 'pending-events',
  templateUrl: './pending-events.component.html',
  styleUrls: ['./pending-events.component.scss']
})
export class PendingEventsComponent implements OnInit {

  pendingEvents: Event[];
  pageNo: number = 1;

  constructor(
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    this.eventService.getPendingEvents(this.pageNo, EventStatus.Pending).subscribe((p: Event[]) => {
      this.pendingEvents = p;
    });
  }

}
