import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounce } from 'lodash';
import { Observable } from 'rxjs';

import { FeedItem } from '../../core/models';
import { JobApiService, PaginationService } from '../../core/services';
import {
  JobListingCardComponent,
  JobListingCardSkeletonComponent,
} from '../../shared/ui';

@Component({
  selector: 'aa-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [
    JobListingCardComponent,
    JobListingCardSkeletonComponent,
    NgForOf,
    AsyncPipe,
    NgIf,
    FormsModule,
  ],
})
export class HomeComponent implements OnInit {
  private jobApiService = inject(JobApiService);
  private paginationService = inject(PaginationService);
  jobs$: Observable<FeedItem[]> = this.paginationService.jobs$;
  filteredJobs$: Observable<FeedItem[]> = this.jobApiService.filteredJobs$;
  loading = this.jobApiService.loadingSignal;
  error = this.jobApiService.errorSignal;
  paginationState = this.paginationService.paginationStateSignal;
  searchTerm = '';
  selectedStatus = 'ACTIVE';
  timeRanges = [
    { label: 'Most recent', value: 'last' },
    { label: 'Last 24 Hours', value: '24h' },
    { label: 'Last 7 Days', value: '7days' },
    { label: 'Last 1 Month', value: '1month' },
  ];
  selectedTimeRange = '24h';

  debouncedSearch = debounce((searchTerm: string) => {
    this.onSearch(searchTerm);
  }, 500);

  ngOnInit(): void {
    this.fetchInitialData();
  }

  fetchInitialData(): void {
    const modifiedSince = this.computeModifiedSince(this.selectedTimeRange);
    this.jobApiService.fetchJobs(undefined, modifiedSince).subscribe();
  }

  fetchNextPage(): void {
    this.jobApiService.fetchNextPage();
    this.scrollToTop();
  }

  fetchPreviousPage(): void {
    this.jobApiService.fetchPreviousPage();
    this.scrollToTop();
  }

  onSearch(searchTerm: string): void {
    console.log(searchTerm);
    this.jobApiService.searchAndFilter(searchTerm, {
      timeRange: this.selectedTimeRange,
      status: this.selectedStatus,
    });
  }

  /**
   * Handles the refresh button click event.
   * Extracts modifiedSince and etag from the current feed metadata and triggers a refresh.
   */
  onRefresh(): void {
    const feedIdMap = this.paginationService.feedIdMapReadonly;

    const currentFeedMetadataIndex =
      this.paginationService.paginationStateSignal().feedMetadataIndex;

    if (!currentFeedMetadataIndex) {
      console.warn('No current feed selected to refresh.');
      return;
    }

    const feedMetadata = feedIdMap.get(currentFeedMetadataIndex);

    if (!feedMetadata) {
      console.error(`No feed metadata found for feed ID: ${currentFeedMetadataIndex}`);
      return;
    }

    const { modifiedSince, etag } = feedMetadata;

    console.log(feedMetadata);

    this.jobApiService
      .fetchJobs(currentFeedMetadataIndex, modifiedSince, etag, true)
      .subscribe();
  }

  onSearchInput(searchTerm: string): void {
    this.jobApiService.setLoading(true);
    this.debouncedSearch(searchTerm);
  }

  computeModifiedSince(range: string): string | undefined {
    const now = new Date();

    if (range === 'last') {
      return 'last';
    }

    const modifiedDate = new Date();
    switch (range) {
      case '24h':
        modifiedDate.setHours(now.getHours() - 24);
        break;
      case '7days':
        modifiedDate.setDate(now.getDate() - 7);
        break;
      case '1month':
        modifiedDate.setMonth(now.getMonth() - 1);
        break;
      default:
        return undefined;
    }

    return modifiedDate.toUTCString();
  }

  /**
   * Handles changes in the selected time range.
   * @param value The new selected time range value
   */
  onTimeRangeChange(value: string): void {
    this.selectedTimeRange = value;
    this.searchTerm = '';
    this.fetchInitialData();
  }

  private scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Determines which jobs to display based on the search term.
   * @returns An observable of the jobs to display.
   */
  get displayJobs$(): Observable<FeedItem[]> {
    return this.searchTerm ? this.filteredJobs$ : this.jobs$;
  }

  /**
   * Determines if there is a next page available.
   */
  get hasNextPage(): boolean {
    return this.paginationService.hasNextPage;
  }

  /**
   * Computes the total number of pages to display.
   * Adds 1 to totalPages if a next page is available.
   */
  get displayTotalPages(): number {
    const state = this.paginationState();
    const isLastPage = state.currentPageIndex + 1 === state.totalPages;
    return isLastPage && this.hasNextPage ? state.totalPages + 1 : state.totalPages;
  }
}
