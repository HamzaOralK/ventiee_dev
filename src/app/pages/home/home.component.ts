import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Store } from '@ngrx/store';
import { EventService } from 'src/app/services/dataServices/event/event-service.service';
import { Subject } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs/internal/Subscription';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { COMMONS } from 'src/app/shared/commons';
import { Router } from '@angular/router';
import * as fromAuth from "../../services/auth/store/auth.reducer";
import * as fromApp from "../../store/app.reducer";
import * as AppAction from "../../store/app.actions";
import { User } from 'src/app/dtos/user';

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  auth: Observable<fromAuth.State>;
  appWise: Observable<fromApp.AppWise>;
  eventSearchText: Subject<string> = new Subject();
  subscription: Subscription = new Subscription();
  value: string = "";
  user: User;

  constructor(
    private eventService: EventService,
    private store: Store<fromApp.AppState>,
    private router: Router
  ) {
    this.auth = this.store.select("authState");
    this.appWise = this.store.select("appWise");
  }
  ngOnInit(): void {
    let eventSearchSubscription = this.eventSearchText
      .pipe(debounceTime(500))
      .subscribe(p => {
        // this.eventService.getEvents(p)
      });
    this.subscription.add(eventSearchSubscription);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onChange(event: any) {
    this.eventSearchText.next(event.target.value);
  }

  clearFilter() {
    this.value = "";
    this.eventSearchText.next(undefined);
  }

  createEvent() {
    let id = COMMONS.generateUUID();
    this.store.dispatch(new AppAction.ToggleLeftNav(false));
    this.router.navigate(["/createEvent/" + id]);
  }
}
