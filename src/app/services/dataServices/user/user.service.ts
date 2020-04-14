import { Injectable } from '@angular/core';
import { User } from 'src/app/dtos/user';
import { CONFIG } from 'src/app/config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';
import { tap } from 'rxjs/operators';
import { NotificationService } from '../../notification/notification.service';
import * as AuthActions from '../../auth/store/auth.actions';
import * as fromAuth from '../../auth/store/auth.reducer';
import * as fromApp from '../../../store/app.reducer';
import { Store } from '@ngrx/store';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private store: Store<fromApp.AppState>,) {

  }

  getUserById(id: string): Observable<User> {
    let url = CONFIG.serviceURL + '/user/get/' + id;
    return this.http.get<User>(url).pipe(catchError(err => {throw err}));
  }

  updateUserById(id: string, user: User) {
    let url = CONFIG.serviceURL + '/user/update/' + id;
    return this.http.post(url, user)
    .pipe(
      tap(p => {
        this.notificationService.notify(p["msg"]);
        this.store.dispatch(new AuthActions.ChangeUser({user}));
      }),
      catchError(err => {throw err})
    );
  }
}
