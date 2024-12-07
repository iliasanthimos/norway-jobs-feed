import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { FeedEntry, FeedItem, FeedPage } from '../models';
import { calculateOverallPageStart, filterJobs } from '../utils';

import { PaginationService } from './pagination.service';

@Injectable({
  providedIn: 'root',
})
export class JobApiService {
  private http = inject(HttpClient);
  private paginationService = inject(PaginationService);

  private baseUrl = `${environment.apiUrl}/${environment.apiVersion}`;
  private bearerToken = environment.authToken;
  private loading = signal<boolean>(false);
  private error = signal<boolean>(false);
  filteredJobs$ = new BehaviorSubject<FeedItem[]>([]);

  /**
   * Fetches the jobs feed from the API.
   * @param nextID
   * @param modifiedSince The date string to check for modified content.
   * @param etag The ETag header value.
   * @param isRefresh Optional flag indicating if this is a refresh operation.
   * @returns An observable that emits the fetched feed page, HttpResponse, or null.
   */

  fetchJobs(
    nextID?: string,
    modifiedSince?: string,
    etag?: string,
    isRefresh = false
  ): Observable<FeedPage | HttpResponse<FeedPage> | null> {
    const headers = this.buildHeaders({ etag, lastModified: modifiedSince });
    // Conditional URL setting based on isRefresh flag
    let url: string;

    // Conditional URL setting based on isRefresh flag
    if (isRefresh && nextID) {
      // When refreshing, set URL to /feed/{pageID}
      url = `${this.baseUrl}/feed/${nextID}`;
    } else {
      // Otherwise, set URL based on modifiedSince and pageID
      url = `${this.baseUrl}/feed${
        modifiedSince === 'last' ? '?last=true' : nextID ? `/${nextID}` : ''
      }`;
    }

    console.log(url);

    if (!nextID) {
      console.log(`Request made to /feed (fresh request). Resetting pagination.`);
      this.resetPagination();
    }

    this.setLoading(true);
    this.setError(false);

    return this.http.get<FeedPage>(url, { headers, observe: 'response' }).pipe(
      tap((response: HttpResponse<FeedPage>) => {
        const data = response.body;

        if (data?.items) {
          const feedId = data.id;
          const etag = response.headers.get('etag') || '';
          const lastModified = response.headers.get('last-modified') || '';
          const activeJobs = data.items.filter(
            job => job._feed_entry.status === 'ACTIVE'
          );

          const isFirstPage = !nextID && modifiedSince !== 'last';
          const isLast = !data.next_id;

          this.paginationService.initializeFeed(feedId, {
            feedId,
            etag,
            lastModified,
            nextID: data.next_id || '',
            jobs: [],
            modifiedSince: modifiedSince || '',
            isFirst: isFirstPage,
            isLast,
            pageIndexMap: {},
            overallPageStart: calculateOverallPageStart(
              this.paginationService.feedIdMapReadonly
            ),
          });

          this.paginationService.addJobs(feedId, activeJobs);

          this.paginationService.updateFeedMetadataIndex(feedId);

          this.paginationService.emitCurrentPageJobs();
        }
      }),
      map((response: HttpResponse<FeedPage>) => response.body || null),
      catchError(error => this.handleError(error)),
      finalize(() => this.setLoading(false))
    );
  }
  /**
   * Fetches a single job entry by its ID.
   * @param entryID The ID of the job entry to fetch.
   * @returns An observable that emits the job entry or null.
   */
  fetchEntry(entryID: string): Observable<FeedEntry | null> {
    const headers = this.buildHeaders();
    const url = `${this.baseUrl}/feedentry/${entryID}`;

    this.setLoading(true);
    this.setError(false);

    return this.http.get<FeedEntry>(url, { headers, observe: 'response' }).pipe(
      map((response: HttpResponse<FeedEntry>) => response.body || null),
      catchError(error => this.handleError(error)),
      finalize(() => this.setLoading(false))
    );
  }

  searchAndFilter(searchQuery: string, filters: Record<string, string | null>): void {
    this.setLoading(true);

    const filtered: FeedItem[] = [];

    this.paginationService.pageMapReadonly.forEach(jobs => {
      const matchingJobs = filterJobs(jobs, searchQuery, filters);
      filtered.push(...matchingJobs);
    });

    this.filteredJobs$.next(filtered);
    console.log(`Filtered jobs:`, filtered);
    this.setLoading(false);
  }

  fetchNextPage(): void {
    const nextPageIndex = this.paginationService.getNextPageIndex();

    // Case 1: Next page exists in pagination
    if (nextPageIndex !== null) {
      console.log(`Fetching next page: ${nextPageIndex}`);
      this.paginationService.setCurrentPage(nextPageIndex);
      return;
    }

    // Case 2: No next page in pagination, check for `nextID`
    if (!this.paginationService.hasNextPage) {
      console.warn('No more pages to fetch.');
      return;
    }

    const currentFeedMetadataIndex =
      this.paginationService.paginationStateSignal().feedMetadataIndex!;
    const feedData = this.paginationService.feedIdMapReadonly.get(
      currentFeedMetadataIndex
    )!;

    this.fetchJobs(feedData.nextID).subscribe(response => {
      if (!response || !('id' in response || 'body' in response)) {
        console.warn('Failed to fetch new jobs or invalid response format.');
        return;
      }

      const newFeedMetadataIndex = 'id' in response ? response.id : response.body!.id;
      this.paginationService.updateFeedMetadataIndex(newFeedMetadataIndex);
      this.paginationService.setCurrentPage(
        this.paginationService.paginationStateSignal().currentPageIndex + 1
      );
      console.log(`Updated feedMetadataIndex to: ${newFeedMetadataIndex}`);
      this.paginationService.emitCurrentPageJobs();
    });
  }

  fetchPreviousPage(): void {
    const previousPageIndex = this.paginationService.getPreviousPageIndex();

    if (previousPageIndex !== null) {
      this.paginationService.setCurrentPage(previousPageIndex);
    } else {
      console.warn('Already at the first page.');
    }
  }

  /**
   * Sets the loading state.
   * @param state The loading state to set (true or false).
   */
  setLoading(state: boolean): void {
    this.loading.set(state);
  }

  /**
   * Sets the error state.
   * @param state The error state to set (true or false).
   */
  private setError(state: boolean): void {
    this.error.set(state);
  }

  /**
   * Handles errors by logging them and setting the error state.
   * @param error The error object.
   * @returns An observable that emits null.
   */
  private handleError(error: unknown): Observable<null> {
    console.error('Error occurred:', error);
    this.setError(true);
    return of(null);
  }

  /**
   * Builds the HTTP headers for the API request.
   * @returns The HttpHeaders object to be used in the API request.
   * @param options
   */
  private buildHeaders(options?: {
    etag?: string;
    lastModified?: string;
    modifiedSince?: string;
  }): HttpHeaders {
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${this.bearerToken}`,
    });

    if (options?.etag) {
      headers = headers.set('If-None-Match', options.etag);
    }

    if (options?.lastModified) {
      headers = headers.set('If-Modified-Since', options.lastModified);
    } else if (options?.modifiedSince) {
      headers = headers.set('If-Modified-Since', options.modifiedSince);
    }

    return headers;
  }

  /**
   * Returns a readonly signal for the loading state.
   */
  get loadingSignal() {
    return this.loading.asReadonly();
  }

  /**
   * Returns a readonly signal for the error state.
   */
  get errorSignal() {
    return this.error.asReadonly();
  }

  /**
   * Returns a readonly signal for the pagination state.
   */
  get getPaginationState() {
    return this.paginationService.paginationStateSignal;
  }

  /**
   * Resets the pagination state and clears job-related data.
   */
  private resetPagination(): void {
    this.paginationService.resetPagination();
    console.log('Pagination state reset. All jobs and metadata cleared.');
  }
}
