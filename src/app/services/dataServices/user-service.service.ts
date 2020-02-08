import { Injectable } from '@angular/core';
import { User } from '../../dtos/user';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as AppAction from '../app/store/app.actions';

@Injectable({ providedIn: 'root' })

export class UserService {
    constructor(
        private http: HttpClient,
        private store: Store<{ app: { leftNavigationOpen: boolean, user: User } }>
        ) {}

    signUp(user: User) {
        return this.http.post('https://angular-http-acab3.firebaseio.com/users.json', user);
    }

    getUser(email: string) {
        return this.http.get('https://angular-http-acab3.firebaseio.com/users.json?orderBy="email"&equalTo="'+ email +'"').subscribe(p => {
            let user: User;
            for(let [key, value] of Object.entries(p)) {
                user = value;
            }
            this.store.dispatch(new AppAction.SetUser(user));
        });
    }
}
