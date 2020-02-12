import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { User } from 'src/app/dtos/user';
import * as AuthActions from '../auth/store/auth.actions';
import * as fromApp from '../../store/app.reducer';
import { CONFIG } from '../../config';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

    constructor(
        private http: HttpClient,
        private store: Store<{ app: fromApp.AppState }>
    ) { }

    signUp(user: User) {
        return this.http.post(CONFIG.serviceURL + '/users.json', user);
    }

    loginUser(email: string) {
        return this.http.get(CONFIG.serviceURL + '/users.json?orderBy="email"&equalTo="' + email + '"').subscribe(p => {
            let user: User;
            for (let [key, value] of Object.entries(p)) {
                user = value;
            }
            this.store.dispatch(new AuthActions.LoginUser(user));
        });
    }


}