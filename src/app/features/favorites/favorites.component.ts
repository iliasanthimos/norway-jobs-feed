import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { FeedEntry, FeedItem } from '../../core/models';
import { FavoriteService, JobApiService } from '../../core/services';
import {
  JobListingCardComponent,
  JobListingCardSkeletonComponent,
} from '../../shared/ui';

@Component({
  selector: 'aa-favorites',
  standalone: true,
  templateUrl: './favorites.component.html',
  imports: [CommonModule, JobListingCardComponent, JobListingCardSkeletonComponent],
})
export class FavoritesComponent implements OnInit {
  private jobApiService = inject(JobApiService);
  private favoriteService = inject(FavoriteService);
  skeletonArray = Array.from({ length: 3 });

  favoriteJobs$: Observable<FeedItem[]> | null = null;

  isFetchingFavorites = signal<boolean>(false);
  hasError = signal<boolean>(false);

  ngOnInit(): void {
    const favoriteIds = this.favoriteService.getFavorites();

    if (favoriteIds.length === 0) {
      this.favoriteJobs$ = of([]);
      return;
    }

    this.isFetchingFavorites.set(true);

    this.favoriteJobs$ = forkJoin(
      favoriteIds.map(id =>
        this.jobApiService.fetchEntry(id).pipe(
          catchError(() => {
            this.hasError.set(true);
            return of(null);
          })
        )
      )
    ).pipe(
      map(entries => entries.filter(entry => entry !== null) as FeedEntry[]),
      map(entries => this.transformEntriesToItems(entries)), // Transform to FeedItem
      map(items => {
        // Reset states after fetching
        this.isFetchingFavorites.set(false);
        this.hasError.set(false);
        return items;
      })
    );
  }

  /**
   * Transforms a list of FeedEntry objects into FeedItem objects.
   *
   * @param {FeedEntry[]} entries
   * @return {FeedItem[]}
   */
  private transformEntriesToItems(entries: FeedEntry[]): FeedItem[] {
    return entries
      .filter(entry => entry.status === 'ACTIVE')
      .map(entry => ({
        id: entry.uuid,
        url: entry.ad_content?.link || '',
        title: entry.ad_content?.title || 'Unknown Title',
        content_text: entry.ad_content?.description || 'No description available',
        date_modified: entry.sistEndret || '',
        _feed_entry: {
          uuid: entry.uuid,
          status: (entry.status || 'INACTIVE') as 'ACTIVE' | 'INACTIVE',
          title: entry.ad_content?.title || 'Unknown Title',
          businessName: entry.ad_content?.employer?.name || 'Unknown',
          municipal: entry.ad_content?.workLocations?.[0]?.municipal || 'Unknown',
          sistEndret: entry.sistEndret || '',
        },
      }));
  }
}
