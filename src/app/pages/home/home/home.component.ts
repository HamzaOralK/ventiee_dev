import { Component, OnInit, ViewChild, AfterViewInit, ViewChildren, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs/internal/Subject';
import { Subscription } from 'rxjs/internal/Subscription';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Router } from '@angular/router';
import * as fromAuth from "../../../services/auth/store/auth.reducer";
import * as fromApp from "../../../store/app.reducer";
import * as AppAction from "../../../store/app.actions";
import { User } from 'src/app/dtos/user';
import { EventService } from 'src/app/services/dataServices/event/event-service.service';
import { AppService } from 'src/app/app.service';
import { Room } from 'src/app/dtos/room';
import { MatTabGroup } from '@angular/material/tabs/tab-group';
import { RoomService } from 'src/app/services/dataServices/room/room.service';
import { EventFilter, EventStatus } from 'src/app/dtos/event';

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
})
export class HomeComponent implements OnInit, AfterViewInit {
  auth: Observable<fromAuth.State>;
  appWise: Observable<fromApp.AppWise>;
  eventSearchText: Subject<string> = new Subject();
  subscription: Subscription = new Subscription();
  value: string = "";
  user: User;
  activeRoom: Room;
  unreadCount: number = 0;

  _loading: boolean = false;
  _isAll: boolean = false;

  @ViewChild('eventScroll') eventScroll: ElementRef;
  @ViewChild('tabs', { static: false }) tabGroup: MatTabGroup;
  @ViewChild('eventScroll') detailFilter: ElementRef;

  showFilter: boolean;
  eventFilter: EventFilter;
  searchText: string;

  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router,
    private eventService: EventService,
    private appService: AppService,
    private roomService: RoomService
  ) {
    this.appWise = this.store.select("appWise");
  }

  ngOnInit(): void {

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
        if(p && p.length >= 3) {
          this.searchText = p;
          this.eventService.getEvents(this.searchText, this.eventFilter).subscribe();
        } else if(p === "") {
          this.searchText = undefined;
          this.eventService.getEvents(undefined, this.eventFilter).subscribe();
        }
      });
    this.subscription.add(eventSearchSubscription);
    this.store.select("roomState").subscribe(p => {
      if(p) {
        this.unreadCount = this.roomService.unreadMessageCount;
        this.activeRoom = p.activeRoom;
      }
    });
  }

  ngAfterViewInit() {
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

  scrollTop() {
    (this.eventScroll.nativeElement as HTMLElement).scrollTo(0,0);
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

  get smallScreen() {
    return this.appService.smallScreen;
  }

  onJoinEvent(event: any) {
    this.tabGroup.selectedIndex = 0;
    this.store.dispatch(new AppAction.FilterEvent(event));
    this.roomService.changeRoom(event._id);
  }

  toggleFilter() {
    this.showFilter = !this.showFilter;
  }

  onSearch(event:any) {
    this._loading = true;
    this.toggleFilter();
    this.eventFilter = event;
    this.eventService.getEvents(this.searchText, this.eventFilter).subscribe(p => {
      this._isAll = false;
      this.scrollTop();
    });
  }

  resize() {
    setTimeout(() => { window.dispatchEvent(new Event("resize")); }, 1000);
  }
}
