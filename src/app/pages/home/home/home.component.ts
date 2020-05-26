import { Component, OnInit, ViewChild, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
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

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  // encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit, AfterViewInit {
  auth: Observable<fromAuth.State>;
  appWise: Observable<fromApp.AppWise>;
  eventSearchText: Subject<string> = new Subject();
  subscription: Subscription = new Subscription();
  value: string = "";
  user: User;
  activeRoom: Room;

  _loading: boolean = false;
  _isAll: boolean = false;

  @ViewChild('eventScroll') eventScroll: ElementRef;
  @ViewChild('tabs', { static: false }) tabGroup: MatTabGroup;

  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router,
    private eventService: EventService,
    private appService: AppService,
    private roomService: RoomService
  ) {
    this.auth = this.store.select("authState");
    this.appWise = this.store.select("appWise");
    this.auth.subscribe(p => {
      this.user = p.user;
    });
  }

  ngOnInit(): void {
    let eventSearchSubscription = this.eventSearchText
      .pipe(debounceTime(500))
      .subscribe(p => {
        if(p && p.length >= 3) {
          this.eventService.getEvents(p).subscribe();
        } else if(p === "") {
          this.eventService.getEvents().subscribe();
        }

      });
    this.subscription.add(eventSearchSubscription);
    this.store.select("roomState").subscribe(p => {
      this.activeRoom = p.activeRoom;
    });
  }

  ngAfterViewInit() {
    if(this.eventScroll) {
      (this.eventScroll.nativeElement as HTMLLIElement).addEventListener('scroll', () => {
        let scrollHeight = (this.eventScroll.nativeElement as HTMLLIElement).scrollHeight;
        let scrollTop = (this.eventScroll.nativeElement as HTMLLIElement).scrollTop;
        let offsetHeight = (this.eventScroll.nativeElement as HTMLLIElement).offsetHeight;
        if (scrollHeight - (scrollTop + offsetHeight) < 1 ) {
          if(!this._isAll) {
            this._loading = true;
            this.eventService.loadMoreEvents().subscribe((p) => {
              if(p.length === 0) {
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
    this.tabGroup.selectedIndex = 1;
    this.store.dispatch(new AppAction.FilterEvent(event));
    this.roomService.changeRoom(event._id);
  }
}
