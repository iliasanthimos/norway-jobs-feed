import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { FeedPage, FeedItem, FeedEntry } from '../models';
import { FeedMetadata } from '../models/feed-meta-data.model';

@Injectable({
  providedIn: 'root',
})
export class JobApiService {
  private baseUrl = `${environment.apiUrl}/${environment.apiVersion}`;
  private bearerToken = environment.authToken;
  private loading = signal<boolean>(false);
  private error = signal<boolean>(false);
  private allJobs: FeedItem[] = [];
  private jobChunks: FeedItem[][] = [];
  private pageSize = 30;
  private paginationState = signal<{
    currentPageIndex: number;
    totalPages: number;
    feedMetadataIndex: string | null;
  }>({
    currentPageIndex: 0,
    totalPages: 0,
    feedMetadataIndex: null,
  });
  private feedMetadata: Record<string, FeedMetadata> = {};
  jobs$ = new BehaviorSubject<FeedItem[]>([]);
  filteredJobs$ = new BehaviorSubject<FeedItem[]>([]);

  constructor(private http: HttpClient) {}

  /**
   * Fetches the jobs feed from the API.
   * @param nextId The next ID for pagination.
   * @param modifiedSince The date string to check for modified content.
   * @returns An observable that emits the fetched feed page or null.
   */
  fetchJobs(nextId?: string, modifiedSince?: string): Observable<FeedPage | null> {
    const headers = this.buildHeaders(modifiedSince);
    const url = `${this.baseUrl}/feed${modifiedSince === 'last' ? '?last=true' : nextId ? `/${nextId}` : ''}`;

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

          this.feedMetadata[feedId] = {
            feedId: data.id,
            etag,
            nextID: data.next_id,
            lastModified,
            jobs: activeJobs,
          };

          if (modifiedSince) {
            this.jobChunks = [];
          }

          this.allJobs = [...this.allJobs, ...activeJobs];

          const newChunks = this.chunkJobs(activeJobs, this.pageSize);
          this.jobChunks = [...this.jobChunks, ...newChunks];

          this.paginationState.set({
            currentPageIndex: 0,
            totalPages: Math.ceil(activeJobs.length / this.pageSize),
            feedMetadataIndex: feedId,
          });
          this.updatePaginationState();

          this.paginateJobs();
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

  /**
   * Searches and filters the jobs based on a search query and filter conditions.
   * @param searchQuery The query to search within job titles.
   * @param filters An object containing filters to apply on job attributes.
   */
  searchAndFilter(searchQuery: string, filters: Record<string, string | null>): void {
    this.setLoading(true);
    let filtered = this.allJobs.filter(job =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    for (const [key, value] of Object.entries(filters)) {
      filtered = filtered.filter(job => {
        if (key in job) {
          return job[key as keyof FeedItem] === value;
        }
        return true;
      });
    }

    this.filteredJobs$.next(filtered);
    this.setLoading(false);
  }

  /**
   * Paginates the fetched jobs to display only the jobs for the current page.
   * @param pageIndex The page index to paginate. Defaults to the current page.
   */
  paginateJobs(pageIndex = this.paginationState().currentPageIndex): void {
    const pageJobs = this.jobChunks[pageIndex] || [];
    this.jobs$.next(pageJobs);
  }

  /**
   * Fetches the next page of jobs, if available, or requests the next set of jobs from the API.
   */
  fetchNextPage(): void {
    const currentPage = this.paginationState();
    const feedId = currentPage.feedMetadataIndex;
    if (currentPage.currentPageIndex + 1 < currentPage.totalPages) {
      this.paginationState.set({
        currentPageIndex: currentPage.currentPageIndex + 1,
        totalPages: currentPage.totalPages,
        feedMetadataIndex: feedId,
      });
      this.paginateJobs();
    } else {
      const latestFeedMetadata = Object.values(this.feedMetadata).pop();
      if (latestFeedMetadata && latestFeedMetadata.nextID) {
        this.fetchJobs(latestFeedMetadata.nextID).subscribe();
      }
    }
  }

  /**
   * Fetches the previous page of jobs.
   */
  fetchPreviousPage(): void {
    if (this.paginationState().currentPageIndex > 0) {
      this.paginationState.set({
        currentPageIndex: this.paginationState().currentPageIndex - 1,
        totalPages: this.paginationState().totalPages,
        feedMetadataIndex: this.paginationState().feedMetadataIndex,
      });
      this.paginateJobs();
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
   * Updates the pagination state based on the current list of jobs.
   */
  private updatePaginationState(): void {
    const totalPages = Math.ceil(this.allJobs.length / this.pageSize);
    const currentPageIndex = this.paginationState().currentPageIndex;

    if (totalPages <= 1) {
      this.paginationState.set({
        currentPageIndex: 0,
        totalPages: 0,
        feedMetadataIndex: this.paginationState().feedMetadataIndex,
      });
    } else {
      this.paginationState.set({
        currentPageIndex,
        totalPages,
        feedMetadataIndex: this.paginationState().feedMetadataIndex,
      });
    }
  }

  /**
   * Chunks an array of items into smaller arrays based on the page size.
   * @param array The array to chunk.
   * @param pageSize The number of items per chunk.
   * @returns A 2D array where each sub-array is a chunk of the original array.
   */
  private chunkJobs<T>(array: T[], pageSize: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += pageSize) {
      chunks.push(array.slice(i, i + pageSize));
    }
    return chunks;
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
   * @param modifiedSince Optional date string to set the "If-Modified-Since" header.
   * @returns The HttpHeaders object to be used in the API request.
   */
  private buildHeaders(modifiedSince?: string): HttpHeaders {
    let headers = new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${this.bearerToken}`,
    });

    if (modifiedSince) {
      headers = headers.set('If-Modified-Since', modifiedSince);
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
    return this.paginationState.asReadonly();
  }
}
