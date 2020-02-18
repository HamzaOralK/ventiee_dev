import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subscription } from 'rxjs/internal/Subscription';
import { EventService } from './services/dataServices/event-service.service';
import * as fromAuth from './services/auth/store/auth.reducer';
import * as fromApp from './store/app.reducer';
import * as AppAction from './store/app.actions';
import { Store } from '@ngrx/store';
import { HammerGestureConfig } from '@angular/platform-browser';


export class MyHammerConfig extends HammerGestureConfig {
  overrides = <any>{
    // override hammerjs default configuration
    'pan': { threshold: 5 },
    'swipe': {
      velocity: 10,
      threshold: 20,
      direction: 4
    }
  }
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit, OnDestroy {
  title = "mitap";
  subscription = new Subscription();
  auth: Observable<fromAuth.State>;

  swipeHammer: MyHammerConfig;
  mainTapHammer: HammerGestureConfig;

  constructor(
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.auth = this.store.select("authState");

    let body = document.body;
    this.swipeHammer = new MyHammerConfig();
    this.swipeHammer.events = ["panright"];
    let swipeHammer = this.swipeHammer.buildHammer(body);
    swipeHammer.on("panright", () => {
      this.openNav();
    });

    let main = document.getElementById("main");
    this.mainTapHammer = new HammerGestureConfig();
    this.mainTapHammer.events = ["tap"];
    let mainTapHammer = this.mainTapHammer.buildHammer(main);
    mainTapHammer.on("tap", () => {
      this.closeNav();
    });
  }

  ngOnDestroy() {}

  openNav() {
    this.store.dispatch(new AppAction.ToggleLeftNav(true));
  }

  closeNav() {
    this.store.dispatch(new AppAction.ToggleLeftNav(false));
  }


}
