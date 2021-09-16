import { Injectable } from '@angular/core';
import { Injector } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

  constructor(
    private injector: Injector,
    private auth: AuthService
  ) { }

  private handleAuthError(err: HttpErrorResponse): Observable<any> {
    //handle your auth error or rethrow
    if (err.status === 401 || err.status === 403) {
      //navigate /delete cookies or whatever
      this.auth.logOutUser();
      // if you've caught / handled the error, you don't want to rethrow it unless you also want downstream consumers to have to handle it as well.
      return of(err.message); // or EMPTY may be appropriate here
    }
    return throwError(err);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authService = this.injector.get(AuthService);
    let token = authService.getToken();
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(req)
      .pipe(catchError(err => {
        if (err.status === 401) {
          authService.logOutUser();
        }
        const error = err.error.message || err.statusText;
        return throwError(error);
      }));
  }

}
