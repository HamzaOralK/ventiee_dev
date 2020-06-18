import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';
import { filter, throttleTime, debounceTime } from 'rxjs/operators';
import * as AppAction from "../../../store/app.actions";
import { EventService } from 'src/app/services/dataServices/event/event-service.service';
import { Subscription, Observable, Subject } from 'rxjs';
import { EventFilter, EventStatus } from 'src/app/dtos/event';
import { RoomService } from 'src/app/services/dataServices/room/room.service';
import { Store } from '@ngrx/store';
import * as fromApp from "../../../store/app.reducer";
import * as fromAuth from "../../../services/auth/store/auth.reducer";
import { User } from 'src/app/dtos/user';
import { Router } from '@angular/router';



@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})
export class EventsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Output('onJoinEvent') onJoinEvent = new EventEmitter();
  @Input() events: Event[];
  // @ViewChild(CdkVirtualScrollViewport) virtualScroll: CdkVirtualScrollViewport;
  @ViewChild('eventScroll') eventScroll: ElementRef;
  auth: Observable<fromAuth.State>;
  user: User;

  _isAll: boolean = false;
  _loading: boolean = false;
  subscription: Subscription;

  showFilter: boolean;
  eventFilter: EventFilter;
  searchText: string;
  eventSearchText: Subject<string> = new Subject();
  value: string = "";

  constructor(
    private scrollDispatcher: ScrollDispatcher,
    private eventService: EventService,
    private roomService: RoomService,
    private store: Store<fromApp.AppState>,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.subscription = new Subscription();
    this.eventFilter = new EventFilter(EventStatus.Active);

    this.auth = this.store.select("authState");
    this.auth.subscribe(p => {
      this.user = p.user;
      if (this.user) this.eventService.getEvents(undefined, this.eventFilter).subscribe();
    });

    let eventSearchSubscription = this.eventSearchText
      .pipe(debounceTime(500))
      .subscribe(p => {
        this._isAll = false;
        if (p && p.length >= 3) {
          this.searchText = p;
          this.eventService.getEvents(this.searchText, this.eventFilter).subscribe();
        } else if (p === "") {
          this.searchText = undefined;
          this.eventService.getEvents(undefined, this.eventFilter).subscribe();
        }
      });
    this.subscription.add(eventSearchSubscription);
  }

  ngAfterViewInit(): void {
    if (this.eventScroll) {
      (this.eventScroll.nativeElement as HTMLLIElement).addEventListener('scroll', () => {
        let scrollHeight = (this.eventScroll.nativeElement as HTMLLIElement).scrollHeight;
        let scrollTop = (this.eventScroll.nativeElement as HTMLLIElement).scrollTop;
        let offsetHeight = (this.eventScroll.nativeElement as HTMLLIElement).offsetHeight;
        if (scrollHeight - (scrollTop + offsetHeight) < 1) {
          if (!this._isAll) {
            this._loading = true;
            this.eventService.loadMoreEvents(this.searchText, this.eventFilter).subscribe((p) => {
              if (p.length === 0) {
                this._isAll = true;
              }
              this._loading = false;
            });
          }
        }
      });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  onJoin(event) {
    this.onJoinEvent.emit();
    this.store.dispatch(new AppAction.FilterEvent(event));
    this.roomService.changeRoom(event._id);
    /** Virtual Scroll kendini yenilesin diye. */
    setTimeout(() => { window.dispatchEvent(new Event("resize"));}, 1000);
  }

  scrollTop() {
    (this.eventScroll.nativeElement as HTMLElement).scrollTo(0, 0);
  }


  onSearch(event: any) {
    this._loading = true;
    this.toggleFilter();
    this.eventFilter = event;
    this.eventService.getEvents(this.searchText, this.eventFilter).subscribe(p => {
      this._loading = false;
      this._isAll = false;
      this.scrollTop();
    });
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  resize() {
    setTimeout(() => { window.dispatchEvent(new Event("resize")); }, 1000);
  }


  onChange(event: any) {
    this.eventSearchText.next(event.target.value);
  }

  clearFilter() {
    this.value = "";
    this.eventSearchText.next(undefined);
  }

  createEvent() {
    this.store.dispatch(new AppAction.ToggleLeftNav(false));
    this.router.navigate(["/createEvent"]);
  }


}
