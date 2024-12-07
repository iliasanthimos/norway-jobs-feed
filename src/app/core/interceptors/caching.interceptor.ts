import {
  HttpInterceptorFn,
  HttpEvent,
  HttpRequest,
  HttpHandlerFn,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';

/**
 * Interceptor function to handle HTTP responses, specifically `304 Not Modified`.
 *
 * @param {HttpRequest<unknown>} req - The outgoing HTTP request.
 * @param {HttpHandlerFn} next - The next handler in the chain to handle the request.
 * @returns {Observable<HttpEvent<unknown>>} - The observable stream that emits the HTTP events.
 */
export const cachingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  // Skip non-GET requests
  if (req.method !== 'GET') {
    return next(req);
  }

  return next(req).pipe(
    tap(event => handleSuccess(event)),
    catchError(error => handleErrorResponse(error))
  );
};

/**
 * Logs successful HTTP responses.
 *
 * @param {HttpEvent<unknown>} event - The HTTP event, which could be a response or progress event.
 */
function handleSuccess(event: HttpEvent<unknown>): void {
  if (event instanceof HttpResponse) {
    if (!environment.production) {
      console.log('HTTP Response:', event);
    }
  }
}

/**
 * Handles errors for the HTTP request, specifically checking for 304 Not Modified.
 * If the error status is 304, logs it and returns a response with status 304 and a null body.
 *
 * @param {HttpErrorResponse} error - The error response from the server.
 * @returns {Observable<HttpEvent<unknown>>} - The observable stream that emits either a 304 response or an error.
 */
function handleErrorResponse(error: HttpErrorResponse): Observable<HttpEvent<unknown>> {
  if (error.status === 304) {
    console.warn('HTTP 304 Not Modified detected:', error.url);
    return of(
      new HttpResponse({
        status: 304,
        body: null, // Null body for 304
        headers: error.headers,
        url: error.url ?? undefined,
      })
    );
  }
  // Propagate other errors
  return throwError(() => error);
}
