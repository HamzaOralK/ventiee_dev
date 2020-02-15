import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AppAction from '../../store/app.actions'
import { Observable } from 'rxjs';
import { User } from 'src/app/dtos/user';
import * as fromApp from '../../store/app.reducer';
import * as fromAuth from '../../services/auth/store/auth.reducer';

@Component({
  selector: 'top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.scss']
})
export class TopNavigationComponent implements OnInit {

    auth: Observable<fromAuth.State>

    constructor(
        private store: Store<fromApp.AppState>
    ) { }

    ngOnInit() {
        this.auth = this.store.select('authState');
    }

    toggleLeftMenu() {
      this.store.dispatch(new AppAction.ToggleLeftNav())
    }

}
