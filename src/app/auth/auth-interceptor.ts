import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { NotificationService } from '../services/notification/notification.service';
import { MultiLanguagePipe } from '../shared/pipes/multi-language.pipe';
import { environment } from 'src/environments/environment';
import { tap } from 'rxjs/operators';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private ml: MultiLanguagePipe
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    //return next.handle(request);
    let authInfoStr = localStorage.getItem(environment.loginLocalStorageKey);
    let authInfo = JSON.parse(authInfoStr);
    let newRequest: HttpRequest<any>;

    let tokenizFreeUrls: string[] = [
      environment.serviceURL + "/user/login",
      environment.serviceURL + "/user/signup",
      environment.serviceURL + "/user/forgotPass",
      environment.serviceURL + "/resetPassword",
      environment.serviceURL + "/resend",
      environment.serviceURL + "/verify",
    ];
    let checkIndex = tokenizFreeUrls.findIndex((p) => request.url.search(p) > -1);

    if (checkIndex === -1) {
      newRequest = request.clone({
        headers: request.headers.set("x-auth-token", authInfo.token),
      });
    } else newRequest = request.clone();

    return next.handle(newRequest).pipe(
      tap(
        (success) => {
          //console.log(success)
        },
        (error) => {
          if (error instanceof HttpErrorResponse) {
            if (error.status !== 401) {
              return;
            } else if (error.status === 401) {
              this.notificationService.notify(this.ml.transform('tokenError'));
              this.authService.logoutUser();
            }
          }
        }
      )
    );
  }
}
