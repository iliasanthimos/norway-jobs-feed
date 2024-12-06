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

// Define a more specific type for cached response body
type CachedResponseBody = Record<string, unknown> | null;

// Simple in-memory cache (for demonstration purposes)
const responseCache = new Map<string, CachedResponseBody>();

/**
 * Interceptor function to cache HTTP GET requests and serve cached data if available.
 * If the response from the server is "304 Not Modified", the cached response is returned.
 *
 * @param {HttpRequest<unknown>} req - The outgoing HTTP request.
 * @param {HttpHandlerFn} next - The next handler in the chain to handle the request.
 * @returns {Observable<HttpEvent<unknown>>} - The observable stream that emits the HTTP events.
 */
export const cachingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  return next(req).pipe(
    tap(event => cacheResponse(event, req)),
    catchError(error => handleErrorResponse(error, req))
  );
};

/**
 * Caches the response body if the response status is 200.
 *
 * @param {HttpEvent<unknown>} event - The HTTP event, which could be a response or progress event.
 * @param {HttpRequest<unknown>} req - The original HTTP request used as a key for caching.
 */
function cacheResponse(event: HttpEvent<unknown>, req: HttpRequest<unknown>): void {
  if (event instanceof HttpResponse && event.status === 200) {
    responseCache.set(req.urlWithParams, event.body as Record<string, unknown> | null);
  }
}

/**
 * Handles errors for the HTTP request, specifically checking for 304 Not Modified.
 * If the error status is 304 and the cache contains a response, returns a cached response.
 *
 * @param {HttpErrorResponse} error - The error response from the server.
 * @param {HttpRequest<unknown>} req - The original HTTP request used to fetch data from the cache.
 * @returns {Observable<HttpEvent<unknown>>} - The observable stream that emits either the cached response or an error.
 */
function handleErrorResponse(
  error: HttpErrorResponse,
  req: HttpRequest<unknown>
): Observable<HttpEvent<unknown>> {
  if (error.status === 304) {
    const cachedData = responseCache.get(req.urlWithParams);
    if (cachedData) {
      return of(
        new HttpResponse({
          status: 200,
          body: cachedData,
          headers: error.headers,
          url: error.url ?? undefined,
        })
      );
    }
  }
  return throwError(() => error);
}
