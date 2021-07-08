
import { throwError as observableThrowError, Observable, BehaviorSubject, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import {
  HttpInterceptor, HttpRequest, HttpHandler, HttpSentEvent, HttpHeaderResponse,
  HttpProgressEvent, HttpResponse, HttpUserEvent, HttpErrorResponse
} from '@angular/common/http';
import { catchError, finalize, switchMap, filter, take } from 'rxjs/operators';


import { environment } from '../environments/environment';
import { AuthService } from './shared/auth/auth.service';



@Injectable()
export class ApiAuthInterceptor implements HttpInterceptor {
  isRefreshingToken = false;
  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(private authService: AuthService) { }

  addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: 'Bearer ' + token } });
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any | HttpSentEvent |
    HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {
    if (req.url.includes(environment.apiUrl) && this.authService.isLoggedIn()) {
      if (!this.authService.isReallyLoggedIn()) {
        return this.logoutUser();
      }
      return next.handle(this.addToken(req, this.authService.getToken())).pipe(
        catchError(error => {
          if (error instanceof HttpErrorResponse) {
            switch ((error as HttpErrorResponse).status) {
              case 401:
                if (req.url === environment.apiUrl + '/token/refresh') {
                  return this.handleExpiredRefreshToken(error);
                }
                return this.handleUnauthorizedAccess(req, next);
              default:
                return throwError(error);
            }
          } else {
            return observableThrowError(error);
          }
        }));
    } else {
      return next.handle(req);
    }

  }

  handleExpiredRefreshToken(error) {
    if (error && error.status === 400 && error.error && error.error.error === 'invalid_grant') {
      // If we get a 400 and the error message is 'invalid_grant', the token is no longer valid so logout.
      return this.logoutUser();
    }

    return observableThrowError(error);
  }

  handleUnauthorizedAccess(req: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshingToken) {
      this.isRefreshingToken = true;

      // Reset here so that the following requests wait until the token
      // comes back from the refreshToken call.
      this.tokenSubject.next(null);

      return this.authService.doRefreshToken().pipe(
        switchMap((newToken: string) => {
          if (newToken) {
            this.tokenSubject.next(newToken);
            this.authService.saveToStorage({ token: newToken });
            return next.handle(this.addToken(req, newToken));
          }

          // If we don't get a new token, we are in trouble so logout.
          return this.logoutUser();
        }),
        catchError(error => {
          // If there is an exception calling 'refreshToken', bad news so logout.
          return this.logoutUser();
        }),
        finalize(() => {
          this.isRefreshingToken = false;
        }));
    } else {
      return this.tokenSubject
        .pipe(
          filter(token => {
            return token != null;
          }),
          take(1),
          switchMap(token => {
            return next.handle(this.addToken(req, token));
          }));
    }
  }

  logoutUser() {
    this.authService.logout();
    return observableThrowError('');
  }
}
