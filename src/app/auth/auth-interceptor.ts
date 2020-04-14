import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { CONFIG } from '../config';
import { tap } from 'rxjs/internal/operators/tap';

export class AuthInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler) {

    //return next.handle(request);
    let authInfoStr = localStorage.getItem(CONFIG.loginLocalStorageKey);
    let authInfo = JSON.parse(authInfoStr);
    let newRequest: HttpRequest<any>;

    let tokenizFreeUrls: string[] = [CONFIG.serviceURL + '/user/login', CONFIG.serviceURL + '/user/signup'];
    let checkIndex = tokenizFreeUrls.findIndex(p => p === request.url);

    if ( checkIndex === -1 ) {
      newRequest = request.clone({
        headers: request.headers.set("x-auth-token", authInfo.token)
      });
    } else
      newRequest = request.clone();


    return next.handle(newRequest).pipe(
      tap(
        success => {
          //console.log(success)
        },
        error => {
          //console.log(error.message)
        }
      ));
  }
}
