import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import * as fromAuth from './services/auth/store/auth.reducer';
import * as AuthActions from './services/auth/store/auth.actions';
import * as fromApp from './store/app.reducer';
import { Store } from '@ngrx/store';
import { HammerGestureConfig } from '@angular/platform-browser';
import { CONFIG } from './config';
import { AuthService } from './services/auth/auth.service';
import { AppService } from './app.service';
import { User } from './dtos/user';
import { EventService } from './services/dataServices/event/event-service.service';

export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    // override hammerjs default configuration
    'pan': { threshold: 100, direction: 4 },
    'swipe': {
      velocity: 10000,
      threshold: 10000,
      direction: 4
    }
  }
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  subscription = new Subscription();
  auth: Observable<fromAuth.State>;
  user: User;

  swipeHammer: MyHammerConfig;
  mainTapHammer: HammerGestureConfig;

  constructor(
    private authService: AuthService,
    private appService: AppService,
    private eventService: EventService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.auth = this.store.select("authState");
    this.auth.subscribe(p => {
      this.user = p.user;
      if (this.user) this.eventService.getEvents();
    })
    this.checkLocalStorage();

    let body = document.body;
    this.swipeHammer = new MyHammerConfig();
    this.swipeHammer.events = ["panright"];
    let swipeHammer = this.swipeHammer.buildHammer(body);
    swipeHammer.on("panright", () => {
      this.appService.openNav();
    });

    let main = document.getElementById("main");
    this.mainTapHammer = new HammerGestureConfig();
    this.mainTapHammer.events = ["tap"];
    let mainTapHammer = this.mainTapHammer.buildHammer(main);
    mainTapHammer.on("tap", () => {
      this.appService.closeNav();
    });
  }

  ngAfterViewInit() { }

  ngOnDestroy() {}

  checkLocalStorage() {
    let str = window.localStorage.getItem(CONFIG.loginLocalStorageKey);
    if(str) {
      this.authService.isLoggedIn = true;
      this.store.dispatch(new AuthActions.LoginUser(JSON.parse(str)));
    }
  }
}
