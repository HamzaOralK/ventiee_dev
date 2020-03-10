import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from './store/app.reducer';
import * as AppAction from './store/app.actions';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private store: Store<fromApp.AppState>,
  ) { }

  openNav() {
    this.store.dispatch(new AppAction.ToggleLeftNav(true));
  }

  closeNav() {
    this.store.dispatch(new AppAction.ToggleLeftNav(false));
  }

}
