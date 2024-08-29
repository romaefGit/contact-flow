import { HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const ErrorResponseInterceptor = (req: any, next: any) =>
  next(req).pipe(catchError(handleErrorResponse));

function handleErrorResponse(error: HttpErrorResponse) {
  const errorResponse = `Roma - Error Status ${error.statusText} Message ${error.message}`;
  console.log('error > ', error);

  return throwError(() => errorResponse);
}
