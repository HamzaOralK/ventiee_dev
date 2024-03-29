import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { User } from 'src/app/dtos/user';
import * as AuthActions from '../auth/store/auth.actions';
import * as fromAuth from '../auth/store/auth.reducer';
import * as fromApp from '../../store/app.reducer';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, of } from 'rxjs';
import { NotificationService } from '../notification/notification.service';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SocialAuthService, FacebookLoginProvider } from 'angularx-social-login';


@Injectable({
  providedIn: "root",
})
export class AuthService {
  isLoggedIn: boolean = false;
  auth: Observable<fromAuth.State>;
  token: string;
  user: User;

  constructor(
    private http: HttpClient,
    private store: Store<fromApp.AppState>,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    private socialAuthService: SocialAuthService
  ) {
    this.auth = this.store.select("authState");
    this.auth.subscribe((p) => {
      this.token = p.token;
    });
    this.store.select("authState").subscribe((p) => {
      this.user = p.user;
    });
    // this.socialAuthService.authState.subscribe(p => {console.log(p)});
  }

  signUp(user: User) {
    return this.http.post(environment.serviceURL + "/user/signup", user).pipe(
      tap((p) => {
        this.notificationService.notify("signUpSuccess");
      }),
      catchError((e) => {
        this.notificationService.notify("signUpError");
        throw e;
      })
    );
  }

  loginUser(user: User) {
    return this.http.post(environment.serviceURL + "/user/login", user).pipe(
      tap((p: { token: string; user: User }) => {
        let user: User = p["user"];
        let token: string = p["token"];
        if (user && token) {
          window.localStorage.setItem(
            environment.loginLocalStorageKey,
            JSON.stringify(p)
          );
          this.isLoggedIn = true;
          let returnURL = this.route.snapshot.queryParamMap.get("url");
          if (returnURL) this.router.navigate([returnURL]);
          else this.router.navigate(["/home"]);
          this.store.dispatch(new AuthActions.LoginUser(p));
        }
        return p;
      }),
      catchError((e) => {
        if (
          e.status === 400 &&
          e.error &&
          e.error.msg === "User is not verified"
        ) {
          this.router.navigate(["/resend", user.email]);
          return of("NotVerified");
        }
        return of("LoginError");
      })
    );
  }

  get httpHeader(): string {
    return this.token;
  }

  logoutUser() {
    this.isLoggedIn = false;
    window.localStorage.removeItem(environment.loginLocalStorageKey);
    this.store.dispatch(new AuthActions.LogoutUser());
    this.router.navigate(["/home"]).then(() => window.location.reload());
  }

  verifyUser(hash: string) {
    return this.http
      .post(environment.serviceURL + "/verify/" + hash, {})
      .subscribe((p) => {
        this.notificationService.notify("verified");
        this.router.navigate(["/home"]);
      });
  }

  resend(resendInfo: { email: string; language: string }) {
    return this.http
      .post(environment.serviceURL + "/resend", resendInfo)
      .subscribe(
        (p) => {
          this.notificationService.notify("mailSent");
        },
        (e) => {
          if (e && e.error && e.error.msg === "User already verified")
            this.router.navigate(["/login"]);
        }
      );
  }

  sendForgotMail(sendInfo: { email: string; language: string }) {
    return this.http
      .post(environment.serviceURL + "/user/forgotPass", sendInfo)
      .subscribe(
        (p) => {
          this.notificationService.notify("resetPassMailSent");
          this.router.navigate(["/home"]);
        },
        (e) => {
          // console.log(e);
        }
      );
  }

  resetPassword(token: string, password: string) {
    return this.http
      .post(environment.serviceURL + "/resetPassword/" + token, { password })
      .subscribe(
        (p) => {
          this.notificationService.notify("resetSuccesfull");
          this.router.navigate(["/login"]);
        },
        (e) => {
          // console.log(e);
        }
      );
  }

  updateToken(imageURI?, language?) {
    let jsonAuthInfo = JSON.parse(
      window.localStorage.getItem(environment.loginLocalStorageKey)
    );
    if (imageURI) jsonAuthInfo.user.imageURI = imageURI;
    if (language) jsonAuthInfo.user.language = language;
    window.localStorage.setItem(
      environment.loginLocalStorageKey,
      JSON.stringify(jsonAuthInfo)
    );
  }

  checkLocalStorage() {
    let str = window.localStorage.getItem(environment.loginLocalStorageKey);
    if (str) {
      this.isLoggedIn = true;
      this.store.dispatch(new AuthActions.LoginUser(JSON.parse(str)));
    }
  }

  signInWithFB() {
    const fbLoginOptions = { scope: 'email' };
    return this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID, fbLoginOptions);
  }
}
