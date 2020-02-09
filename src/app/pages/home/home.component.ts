import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/services/dataServices/event-service.service';
import { Event } from 'src/app/dtos/event';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    constructor(private eventService: EventService) { }

    ngOnInit(): void {
        /*
        let event = new Event();
        event.id = '2';
        event.title = 'Beer at Kadıköy';
        event.peopleCount = 5;
        this.eventService.addEvent(event);
        */
    }

}
