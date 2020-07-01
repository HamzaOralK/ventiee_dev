import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { debounceTime } from 'rxjs/operators';
import { EventService } from 'src/app/services/dataServices/event/event-service.service';
import { Subscription, Observable, Subject } from 'rxjs';
import { EventFilter, EventStatus } from 'src/app/dtos/event';
import { Store } from '@ngrx/store';
import * as fromApp from "../../../store/app.reducer";
import * as AppAction from "../../../store/app.actions";
import * as fromAuth from "../../../services/auth/store/auth.reducer";
import * as fromRoom from "../../../services/dataServices/room/store/room.reducer";
import { User } from 'src/app/dtos/user';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { EventListType } from 'src/app/dtos/enums';
import { environment } from 'src/environments/environment';
import { NotificationService, SnackType } from 'src/app/services/notification/notification.service';

@Component({
  selector: 'events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss']
})

export class EventsComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() user: User;
  @Input() events;
  @Input() type: EventListType = EventListType.All; // 'all' bütün eventler, 'user' user eventleri, 'history' history
  @Output('onJoinEvent') onJoinEvent = new EventEmitter();
  @ViewChild('eventScroll') eventScroll: ElementRef;
  auth: Observable<fromAuth.State>;

  roomStates: Observable<fromRoom.State>;
  currentRoomsQuantity: number = 0;

  _isAll: boolean = false;
  _loading: boolean = false;
  subscription: Subscription;
  _pageNo: number;

  showFilter: boolean;
  eventFilter: EventFilter;
  searchText: string;
  eventSearchText: Subject<string> = new Subject();
  value: string = "";

  constructor(
    private eventService: EventService,
    private store: Store<fromApp.AppState>,
    private router: Router,
    private appService: AppService,
    private notificationService: NotificationService
  ) { }

  ngOnInit(): void {
    this._pageNo = 1;
    this.subscription = new Subscription();
    this.eventFilter = new EventFilter();
    this.auth = this.store.select("authState");
    this.roomStates = this.store.select("roomState");
    this.roomStates.subscribe(p => {
      if(p.rooms) this.currentRoomsQuantity = p.rooms.length;
    });
    /** Bütün eventler */
    if(this.type === EventListType.All) {
      this.eventFilter.status = EventStatus.Active;
      this.auth.subscribe(p => {
        if (p.user) this.eventService.getEvents(this._pageNo, undefined, this.eventFilter).subscribe();
      });
      let eventSearchSubscription = this.eventSearchText.pipe(debounceTime(500)).subscribe(p => {
        this.processEventSearchText(p);
      });
      this.subscription.add(eventSearchSubscription);
    }
    /** Profiline bakılan kullanıcının aktif eventleri */
    else if (this.type === EventListType.User) {
      this.auth.subscribe(p => {
        if (p.user && this.user) this.eventService.getEventsByModId(this.user._id).subscribe(r => {
          this.events = r;
        })
      });
    }
    /** Login kullanıcının geçmiş eventleri */
    else if (this.type === EventListType.History) {
      this.auth.subscribe(p => {
        if (p.user) this.eventService.getHistoryEventsOfUser(this._pageNo, undefined).subscribe();
      });

      let eventSearchSubscription = this.eventSearchText.pipe(debounceTime(500)).subscribe(p => {
        this.processEventSearchText(p);
      });
      this.subscription.add(eventSearchSubscription);
    }

    this.appService._resetEvents.subscribe(p => {
      if(this.type === EventListType.All) {
        this.resetPage();
      }
    });

  }

  ngAfterViewInit(): void {
    if (this.eventScroll && (this.type === EventListType.All || this.type === EventListType.History)) {
      (this.eventScroll.nativeElement as HTMLLIElement).addEventListener('scroll', () => {
        let scrollHeight = (this.eventScroll.nativeElement as HTMLLIElement).scrollHeight;
        let scrollTop = (this.eventScroll.nativeElement as HTMLLIElement).scrollTop;
        let offsetHeight = (this.eventScroll.nativeElement as HTMLLIElement).offsetHeight;
        if (scrollHeight - (scrollTop + offsetHeight) < 1) {
          if (!this._isAll) {
            this._loading = true;
            if (this.type === EventListType.All) {
              this.eventService.getEvents(this._pageNo, this.searchText, this.eventFilter).subscribe((p) => {
                this.processLoadMore(p);
              });
            } else if (this.type === EventListType.History) {
              this.eventService.getHistoryEventsOfUser(this._pageNo, this.searchText).subscribe(p => {
                this.processLoadMore(p);
              })
            }
          }
        }
      });
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private processLoadMore(p: any) {
    if (p) {
      if (p.length === 0) {
        this._isAll = true;
      }
      else if (p.length > 0) {
        this._pageNo++;
      }
    }
    this._loading = false;
  }

  private processEventSearchText(p: string) {
    this._isAll = false;
    this._pageNo = 1;
    if (p && p.length >= 3) {
      this.searchText = p;
    }
    else if (p === "") {
      this.searchText = undefined;
    }
    this.scrollTop();
    if (this.type === EventListType.All) this.eventService.getEvents(this._pageNo, this.searchText, this.eventFilter).subscribe();
    if (this.type === EventListType.History) this.eventService.getHistoryEventsOfUser(this._pageNo, this.searchText).subscribe();
  }

  onJoin(event) {
    this.onJoinEvent.emit();
  }

  scrollTop() {
    (this.eventScroll.nativeElement as HTMLElement).scrollTo(0, 0);
  }

  onSearch(event: any) {
    this._loading = true;
    this.toggleFilter();
    this.eventFilter = event;
    this._pageNo = 1;
    this.eventService.getEvents(this._pageNo, this.searchText, this.eventFilter).subscribe(p => {
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
    if(this.currentRoomsQuantity < environment.maxRoomNumber) {
      this.store.dispatch(new AppAction.ToggleLeftNav(false));
      this.router.navigate(["/createEvent"]);
    } else {
      this.notificationService.notify("maxRoomNumberReached", SnackType.warn, "OK");
    }
  }

  resetPage() {
    this.eventFilter = new EventFilter();
    if (this.type === EventListType.All) {
      this.eventFilter.status = EventStatus.Active;
    }
    this._pageNo = 1;
    this.searchText = undefined;
    this.eventService.getEvents(this._pageNo, this.searchText, this.eventFilter).subscribe(p => {
      this._loading = false;
      this._isAll = false;
      this.scrollTop();
    });
  }

}
