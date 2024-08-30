import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    let token = null;

    let request = req;

    if (token) {
      request = req.clone({
        setHeaders: {
          authorization: `Bearer something`,
        },
      });
    }

    return next.handle(request).pipe(catchError(this.handleError));
  }

  private handleError(err: HttpErrorResponse): Observable<never> {
    if (err.status === 401) {
      // this.router.navigate(['session', 'login']);
    }
    // just a test ... more could would go here
    return throwError(() => err);
  }
}
