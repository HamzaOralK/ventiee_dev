import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { User } from 'src/app/dtos/user';
import * as AuthActions from '../auth/store/auth.actions';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromApp from '../../store/app.reducer';
import { CONFIG } from '../../config';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { NotificationService } from '../notification/notification.service';
import { LangService } from '../lang/lang.service';
import { catchError, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  isLoggedIn: boolean = false;
  auth: Observable < fromAuth.State > ;
  token: string;
  user: User;

  constructor(
    private http: HttpClient,
    private store: Store < fromApp.AppState > ,
    private router: Router,
    private notificationService: NotificationService,
    private langService: LangService
  ) {
    this.auth = this.store.select('authState');
    this.auth.subscribe(p => {
      this.token = p.token;
    });
    this.store.select("authState").subscribe(p => {
      this.user = p.user;
    });
  }

  signUp(user: User) {
    return this.http.post(CONFIG.serviceURL + '/user/signup', user).pipe(
      tap(p => {
        this.notificationService.notify(this.langService.get('signUpSuccess'));
      }),
      catchError(e => {
        this.notificationService.notify(this.langService.get('signUpError'));
        throw e;
      })
    );
  }

  loginUser(user: User) {
    return this.http.post(CONFIG.serviceURL + '/user/login', user).subscribe(
      (p: {token: string, user: User}) => {
        let user: User = p["user"];
        let token: string = p["token"];
        if (user && token) {
          window.localStorage.setItem(CONFIG.loginLocalStorageKey, JSON.stringify(p));
          this.isLoggedIn = true;
          this.router.navigate(['/home']);
          this.store.dispatch(new AuthActions.LoginUser(p));
        }
      },
      e => {
        if (e.status === 400 && (e.error && e.error.msg === 'User is not verified')) {
          this.router.navigate(['/resend', user.email]);
        }
        this.notificationService.notify(this.langService.get('loginError'), 'OK')
      }
    );
  }

  get httpHeader(): string {
    return this.token;
  }

  logoutUser() {
    this.isLoggedIn = false;
    window.localStorage.removeItem(CONFIG.loginLocalStorageKey);
    this.store.dispatch(new AuthActions.LogoutUser());
    this.router.navigate(['/home']).then(() => window.location.reload());
  }

  verifyUser(hash: string) {
    return this.http.put(CONFIG.serviceURL + '/verify/'+ hash, {}).subscribe(p => {
      console.log(p);
      this.router.navigate(['/home']);
    });
  }

}
