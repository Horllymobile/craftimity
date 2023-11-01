import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { ErrorHandlerService } from '../services/error-handler.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private errorHandler: ErrorHandlerService) {}
  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const skipErrorIntercept = req.headers.has('skipErrorInterceptor');

    if (skipErrorIntercept) {
      req = req.clone({
        headers: req.headers.delete('skipErrorInterceptor'),
      });
      return next.handle(req);
    }

    return next.handle(req).pipe(
      catchError((error) => {
        return this.errorHandler.handleError(error);
      })
    );
  }
}
