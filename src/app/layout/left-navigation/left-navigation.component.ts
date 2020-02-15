import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { Observable, Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as fromApp from '../../store/app.reducer';
import * as AppAction from '../../store/app.actions';
import { EventService } from 'src/app/services/dataServices/event-service.service';
import { COMMONS } from 'src/app/shared/commons';
import { Router } from '@angular/router';

@Component({
  selector: "left-navigation",
  templateUrl: "./left-navigation.component.html",
  styleUrls: ["./left-navigation.component.scss"]
})
export class LeftNavigationComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("drawer", { static: false }) drawer: MatSidenav;

  appWise: Observable<fromApp.AppWise>;
  eventSearchText: Subject<string> = new Subject();
  subscription: Subscription = new Subscription();
  value: string = "";

  constructor(
    private cdr: ChangeDetectorRef,
    private store: Store<fromApp.AppState>,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit() {
    this.appWise = this.store.select("appWise");
    this.eventSearchText
      .pipe(debounceTime(500))
      .subscribe(p => this.eventService.getEvents(p));
    this.subscription.add(this.eventSearchText);
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
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
    this.router.navigate(["/createEvent/"+id]);
  }

}
