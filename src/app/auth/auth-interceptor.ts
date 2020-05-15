import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../config';
import { tap } from 'rxjs/internal/operators/tap';
import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { NotificationService } from '../services/notification/notification.service';

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    //return next.handle(request);
    let authInfoStr = localStorage.getItem(CONFIG.loginLocalStorageKey);
    let authInfo = JSON.parse(authInfoStr);
    let newRequest: HttpRequest<any>;

    let tokenizFreeUrls: string[] = [
      CONFIG.serviceURL + "/user/login",
      CONFIG.serviceURL + "/user/signup",
      CONFIG.serviceURL + "/user/forgotPass",
      CONFIG.serviceURL + "/resetPassword",
      CONFIG.serviceURL + "/resend",
      CONFIG.serviceURL + "/verify",
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
              this.notificationService.notify('tokenError');
              this.authService.logoutUser();
            }
          }
        }
      )
    );
  }
}
