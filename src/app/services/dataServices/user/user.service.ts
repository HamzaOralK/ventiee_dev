import { Injectable } from '@angular/core';
import { User } from 'src/app/dtos/user';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { NotificationService } from '../../notification/notification.service';
import * as AuthActions from '../../auth/store/auth.actions';
import * as fromApp from '../../../store/app.reducer';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private store: Store<fromApp.AppState>,
    private authService: AuthService
  ) {

  }

  getUserById(id: string): Observable<User> {
    let url = environment.serviceURL + '/user/get/' + id;
    return this.http.get<User>(url).pipe(catchError(err => {throw err}));
  }

  getUserMe(id: string): Observable<User> {
    let url = environment.serviceURL + '/user/me/' + id;
    return this.http.get<User>(url).pipe(catchError(err => { throw err }));
  }

  updateUserById(id: string, user: User) {
    let url = environment.serviceURL + '/user/update/' + id;
    return this.http.post(url, user)
    .pipe(
      tap(p => {
        if(p) {
          if(p["imageURI"]) {
            this.authService.updateToken(p["imageURI"]);
            user.imageURI = p["imageURI"];
          }
          if(p["language"]) {
            this.authService.updateToken(undefined, p["language"]);
            user.language = p["language"];
          }
        }
        this.notificationService.notify(p["msg"]);
        this.store.dispatch(new AuthActions.ChangeUser({user}));
      }),
      catchError(err => {throw err})
    );
  }
}
