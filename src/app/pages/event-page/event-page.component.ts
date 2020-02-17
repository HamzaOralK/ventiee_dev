import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { EventService } from 'src/app/services/dataServices/event-service.service';
import { Event } from '../../dtos/event';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'event-page',
  templateUrl: './event-page.component.html',
  styleUrls: ['./event-page.component.scss']
})
export class EventPageComponent implements OnInit {

  event$: Observable<any>;
  event: Event;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService
  ) { }

  ngOnInit(): void {
    let eventId = this.route.snapshot.paramMap.get('id');
    this.event$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) => this.eventService.getEventById(params.get('id')))
    );
    this.event$.subscribe(p => this.event = Object.values(p)[0] as Event);
  }

}
