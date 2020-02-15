import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { EventService } from './services/dataServices/event-service.service';
import * as fromAuth from './services/auth/store/auth.reducer';
import * as fromApp from './store/app.reducer';
import { Store } from '@ngrx/store';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit, OnDestroy {
    title = 'mitap';
    subscription = new Subscription();
    auth: Observable<fromAuth.State>;


    constructor(
      private eventService: EventService,
      private store: Store<fromApp.AppState>
    ) { }

    ngOnInit() {
      this.eventService.getEvents();
      this.auth = this.store.select('authState');
    }

    ngOnDestroy() { }
}
