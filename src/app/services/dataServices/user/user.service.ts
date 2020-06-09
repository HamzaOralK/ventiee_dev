import { Injectable } from '@angular/core';
import { User } from 'src/app/dtos/user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { catchError } from 'rxjs/internal/operators/catchError';
import { tap } from 'rxjs/operators';
import { NotificationService } from '../../notification/notification.service';
import * as AuthActions from '../../auth/store/auth.actions';
import * as fromAuth from '../../auth/store/auth.reducer';
import * as fromApp from '../../../store/app.reducer';
import { Store } from '@ngrx/store';
import { MultiLanguagePipe } from 'src/app/shared/pipes/multi-language.pipe';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
    private store: Store<fromApp.AppState>,
    private ml: MultiLanguagePipe,
    private authService: AuthService
  ) {

  }

  getUserById(id: string): Observable<User> {
    let url = environment.serviceURL + '/user/get/' + id;
    return this.http.get<User>(url).pipe(catchError(err => {throw err}));
  }

  updateUserById(id: string, user: User) {
    let url = environment.serviceURL + '/user/update/' + id;
    return this.http.post(url, user)
    .pipe(
      tap(p => {
        if(p && p["imageURI"]) {
          this.authService.updateToken(p["imageURI"]);
          user.imageURI = p["imageURI"];
        }

        this.notificationService.notify(this.ml.transform(p["msg"]));
        this.store.dispatch(new AuthActions.ChangeUser({user}));
      }),
      catchError(err => {throw err})
    );
  }
}
