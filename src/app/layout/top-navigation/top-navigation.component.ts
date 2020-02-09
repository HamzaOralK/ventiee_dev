import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AppAction from '../../services/app/store/app.actions'
import { Observable } from 'rxjs';
import { User } from 'src/app/dtos/user';
import { AppState } from 'src/app/services/state';

@Component({
  selector: 'top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.scss']
})
export class TopNavigationComponent implements OnInit {

    appState: Observable<AppState>

    constructor(
        private store: Store<{ app: AppState }>
    ) { }
    
    ngOnInit() { 
        this.appState = this.store.select('app');
    }
    
    toggleLeftMenu() {
        this.store.dispatch(new AppAction.ToggleSideNav())
    }

}
