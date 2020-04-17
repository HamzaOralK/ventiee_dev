import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../config';
import { tap } from 'rxjs/internal/operators/tap';
import { Router } from '@angular/router';
import { Injector, Injectable } from '@angular/core';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    //return next.handle(request);
    let authInfoStr = localStorage.getItem(CONFIG.loginLocalStorageKey);
    let authInfo = JSON.parse(authInfoStr);
    let newRequest: HttpRequest<any>;

    let tokenizFreeUrls: string[] = [
      CONFIG.serviceURL + "/user/login",
      CONFIG.serviceURL + "/user/signup",
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
            }
            this.router.navigate(["home"]);
          }
        }
      )
    );
  }
}
