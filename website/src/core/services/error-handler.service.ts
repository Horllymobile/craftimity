import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor() {}

  handleError(error?: ErrorEvent | HttpErrorResponse): Observable<never> {
    let errorMessage: string = '';
    if (!navigator.onLine) {
    } else if (error instanceof HttpErrorResponse) {
      errorMessage = this.processErrorMessage(error);
    } else if (error?.error instanceof ErrorEvent) {
      errorMessage = error?.error?.message
        ? error?.error?.message
        : error?.error.error.toString() ?? 'An error occured';
    }
    return throwError(() => errorMessage);
  }

  processErrorMessage(error: HttpErrorResponse): string {
    const apiErrorResponse = error.error;
    let message: string = '';
    switch (error.status) {
      case 400:
        message = apiErrorResponse.message[0];
        break;
      case 402:
        if (apiErrorResponse) {
        }
        break;
      case 401:
      case 403:
      case 404:
      case 409:
      case 500:
        message = apiErrorResponse.message;
        break;
      case 500:
        message =
          'An unknown error occure and we are unable to handle your request. Please try again';
    }

    return message;
  }
}
