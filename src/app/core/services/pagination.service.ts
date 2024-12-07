import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';
import { FeedMetadata, FeedItem } from '../models';
import { chunkArray } from '../utils';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  private pageSize = environment.defaultPageSize || 300;

  private paginationState = signal<{
    currentPageIndex: number;
    totalPages: number;
    feedMetadataIndex: string | null;
  }>({
    currentPageIndex: 0,
    totalPages: 0,
    feedMetadataIndex: null,
  });

  private feedIdMap = new Map<string, FeedMetadata>();
  private pageMap = new Map<number, FeedItem[]>();

  jobs$ = new BehaviorSubject<FeedItem[]>([]);

  /**
   * Initializes or updates feed metadata.
   * @param feedId The ID of the feed.
   * @param feedMetadata The metadata associated with the feed.
   */
  initializeFeed(feedId: string, feedMetadata: FeedMetadata): void {
    if (!this.feedIdMap.has(feedId)) {
      this.feedIdMap.set(feedId, feedMetadata);
    } else {
      this.feedIdMap.set(feedId, { ...this.feedIdMap.get(feedId)!, ...feedMetadata });
    }

    this.paginationState.update(state => ({
      ...state,
      totalPages: this.pageMap.size,
    }));
  }

  /**
   * Adds new jobs and updates pagination.
   * @param feedId The ID of the feed.
   * @param jobs The jobs to add.
   */
  addJobs(feedId: string, jobs: FeedItem[]): void {
    const feedData = this.feedIdMap.get(feedId);
    if (!feedData) return;

    const newChunks = chunkArray(jobs, this.pageSize);
    const currentPageIndex = this.pageMap.size;

    newChunks.forEach((chunk, index) => {
      const pageNumber = feedData.overallPageStart + currentPageIndex + index;
      this.pageMap.set(pageNumber, chunk);
    });

    this.paginationState.update(state => ({
      ...state,
      totalPages: this.pageMap.size,
    }));
    console.log(`Adding jobs for next ID: ${feedId}`);
    console.log(this.pageMap);
    console.log(this.feedIdMap);
  }

  /**
   * Sets the current page and emits the jobs for that page.
   * @param pageIndex The index of the page to set.
   */
  setCurrentPage(pageIndex: number): void {
    if (pageIndex < 0 || pageIndex >= this.paginationState().totalPages) {
      console.warn('Invalid page index:', pageIndex);
      return;
    }

    this.paginationState.update(state => ({
      ...state,
      currentPageIndex: pageIndex,
    }));

    this.emitCurrentPageJobs();
  }

  /**
   * Emits the jobs for the current page.
   */
  emitCurrentPageJobs(): void {
    const pageIndex = this.paginationState().currentPageIndex;
    const pageJobs = this.pageMap.get(pageIndex) || [];
    this.jobs$.next(pageJobs);
  }

  /**
   * Retrieves the next page index if available.
   * @returns The next page index or null.
   */
  getNextPageIndex(): number | null {
    const nextIndex = this.paginationState().currentPageIndex + 1;
    return nextIndex < this.paginationState().totalPages ? nextIndex : null;
  }

  /**
   * Retrieves the previous page index if available.
   * @returns The previous page index or null.
   */
  getPreviousPageIndex(): number | null {
    const prevIndex = this.paginationState().currentPageIndex - 1;
    return prevIndex >= 0 ? prevIndex : null;
  }

  /**
   * Updates the feed metadata index.
   * @param feedMetadataIndex The new feed metadata index.
   */
  updateFeedMetadataIndex(feedMetadataIndex: string | null): void {
    this.paginationState.update(state => ({
      ...state,
      feedMetadataIndex,
    }));
  }

  /**
   * Resets the pagination state and clears all data.
   */
  resetPagination(): void {
    this.paginationState.set({
      currentPageIndex: 0,
      totalPages: 0,
      feedMetadataIndex: null,
    });
    this.feedIdMap.clear();
    this.pageMap.clear();
    this.jobs$.next([]);
    console.log('Pagination state reset. All jobs and metadata cleared.');
  }

  /**
   * Provides a readonly signal for pagination state.
   */
  get paginationStateSignal() {
    return this.paginationState.asReadonly();
  }

  /**
   * Provides readonly access to feedIdMap.
   */
  get feedIdMapReadonly() {
    return this.feedIdMap;
  }

  /**
   * Provides readonly access to pageMap.
   */
  get pageMapReadonly() {
    return this.pageMap;
  }

  /**
   * Determines if a next page is available.
   */
  get hasNextPage(): boolean {
    const state = this.paginationState();
    if (state.feedMetadataIndex) {
      const feedData = this.feedIdMap.get(state.feedMetadataIndex);
      return !!feedData?.nextID;
    }
    return false;
  }
}
