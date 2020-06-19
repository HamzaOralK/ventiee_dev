import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/internal/Subscription';
import * as fromAuth from "../../../services/auth/store/auth.reducer";
import * as fromApp from "../../../store/app.reducer";
import { User } from 'src/app/dtos/user';
import { AppService } from 'src/app/app.service';
import { Room } from 'src/app/dtos/room';
import { RoomService } from 'src/app/services/dataServices/room/room.service';
import { TabsComponent } from 'src/app/components/tabs/tabs/tabs.component';

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"]
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

  @ViewChild('tabs', { static: false }) tabsComponent: TabsComponent;

  showFilter: boolean;
  searchText: string;

  constructor(
    private store: Store<fromApp.AppState>,
    private appService: AppService,
    private roomService: RoomService
  ) {
    this.appWise = this.store.select("appWise");
  }

  ngOnInit(): void {
    this.auth = this.store.select("authState");
    this.auth.subscribe(p => {
      this.user = p.user;
    });

    this.store.select("roomState").subscribe(p => {
      if(p) {
        this.unreadCount = this.roomService.unreadMessageCount;
        this.activeRoom = p.activeRoom;
      }
    });
  }

  ngAfterViewInit() { }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get smallScreen() {
    return this.appService.smallScreen;
  }

  onJoinEvent() {
    this.tabsComponent.changeSelectedTab(0);
  }

}
