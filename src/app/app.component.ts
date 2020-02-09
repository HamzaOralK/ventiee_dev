import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { EventService } from './services/dataServices/event-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
    title = 'mitap';
    subscription = new Subscription();

    constructor( private eventService: EventService ) { }

    ngOnInit() {
        this.eventService.getEvents();
    }

    ngOnDestroy() { }
}
