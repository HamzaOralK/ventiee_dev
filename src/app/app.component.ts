import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import * as fromAuth from './services/auth/store/auth.reducer';
import * as fromApp from './store/app.reducer';
// import * as Hammer from 'hammerjs';
import { Store } from '@ngrx/store';
import { HammerGestureConfig } from '@angular/platform-browser';
import { User } from './dtos/user';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, Observable } from 'rxjs';
import { isDevMode } from '@angular/core';



// export class MyHammerConfig extends HammerGestureConfig {
//   overrides = <any>{
//     // override hammerjs default configuration
//     'pan': { threshold: 100, direction: Hammer.DIRECTION_HORIZONTAL },
//     'swipe': {
//       velocity: 10000,
//       threshold: 10000,
//       direction: Hammer.DIRECTION_HORIZONTAL
//     },
//     'pinch': { enable: false },
//     'rotate': { enable: false }
//   }
// }

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  subscription = new Subscription();
  auth: Observable<fromAuth.State>;
  user: User;

  // swipeHammer: MyHammerConfig;
  mainTapHammer: HammerGestureConfig;

  constructor(
    private store: Store<fromApp.AppState>,
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && !isDevMode()) {
        (<any>window).ga("set", "page", event.urlAfterRedirects);
        (<any>window).ga("send", "pageview");
      }
    });
  }

  ngOnInit() {
    this.auth = this.store.select("authState");
    this.auth.subscribe(p => {
      this.user = p.user;
    });
  }

  ngAfterViewInit() { }

  ngOnDestroy() {}

}
