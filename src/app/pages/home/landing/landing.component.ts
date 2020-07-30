import { Component, OnInit, OnDestroy } from '@angular/core';
import { Event } from 'src/app/dtos/event';
import { EventService } from 'src/app/services/dataServices/event/event-service.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit, OnDestroy {
  events: Event[];
  subscription = new Subscription();
  isLoading = true;
  constructor(
    private eventService: EventService,
    private router: Router
  ) { }

  ngOnInit(): void {
    let pEventSub = this.eventService.getPublicEvents().subscribe(p => {
      this.events = p as Event[];
      this.isLoading = false;
    });
    this.subscription.add(pEventSub);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  goEventItem(eventId: string) {
    this.router.navigate(['/ventiee/'+eventId]);
  }

  goSignUp(el: HTMLElement) {
    // el.scrollIntoView();
    this.router.navigate(['/signup'])
  }

}
