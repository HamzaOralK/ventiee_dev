import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromAuth from "../../../services/auth/store/auth.reducer";
import * as fromApp from "../../../store/app.reducer";
import { User } from 'src/app/dtos/user';
import { AppService } from 'src/app/app.service';
import { Room } from 'src/app/dtos/room';
import { RoomService } from 'src/app/services/dataServices/room/room.service';
import { TabsComponent } from 'src/app/components/tabs/tabs/tabs.component';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SnackType, NotificationService } from 'src/app/services/notification/notification.service';
import { LangService } from 'src/app/services/lang/lang.service';
import { Languages } from 'src/app/dtos/languages';

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, AfterViewInit {
  auth: Observable<fromAuth.State>;
  appWise: Observable<fromApp.AppWise>;
  subscription: Subscription = new Subscription();
  user: User;
  activeRoom: Room;
  unreadCount: number = 0;

  _loading: boolean = false;
  _isAll: boolean = false;

  language: any;

  @ViewChild("tabs", { static: false }) tabsComponent: TabsComponent;

  showFilter: boolean;
  searchText: string;

  constructor(
    private store: Store<fromApp.AppState>,
    private appService: AppService,
    private roomService: RoomService,
    private router: Router,
    private notificationService: NotificationService,
    private langService: LangService
  ) {
    this.appWise = this.store.select("appWise");
    this.language = this.langService.language;
  }

  ngOnInit(): void {
    this.auth = this.store.select("authState");
    this.auth.subscribe((p) => {
      this.user = p.user;
    });


    this.store.select("roomState").subscribe((p) => {
      if (p) {
        this.unreadCount = this.roomService.unreadMessageCount;
        this.activeRoom = p.activeRoom;
      }
    });

    this.roomService.routerRoomInfo.subscribe(p => {
      if(p && p._id) this.roomService.changeRoom(p._id);
    });

  }

  ngAfterViewInit() {}

  ngOnDestroy() {
    this.roomService.routerRoomInfo.next(undefined);
    this.subscription.unsubscribe();
  }

  get smallScreen() {
    return this.appService.smallScreen;
  }

  onJoinEvent() {
    this.tabsComponent.changeSelectedTab(0);
  }

  createEvent() {
    if(this.roomService.rooms.length < environment.maxRoomNumber)
      this.router.navigate(["/createEvent"]);
    else {
      this.notificationService.notify("maxRoomNumberReached", SnackType.warn, "OK");
    }
  }

  goAllEvents() {
    this.tabsComponent.changeSelectedTab(1);
  }

  getLanguage() {

  }

}
