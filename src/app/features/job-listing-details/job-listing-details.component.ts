import { DatePipe, NgIf, NgForOf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

import { FeedEntry } from '../../core/models';
import { JobApiService } from '../../core/services';
import { JobListingDetailsSkeletonComponent } from '../../shared/ui';
import { FavoriteToggleComponent } from '../../shared/ui/favorite-toggle/favorite-toggle.component';

@Component({
  selector: 'aa-job-listing-details',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    NgForOf,
    JobListingDetailsSkeletonComponent,
    FaIconComponent,
    FavoriteToggleComponent,
  ],
  templateUrl: './job-listing-details.component.html',
})
export class JobListingDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private jobApiService = inject(JobApiService);
  private sanitizer = inject(DomSanitizer);
  safeDescription: SafeHtml | null = null;
  safeEmployerDescription: SafeHtml | null = null;
  job: FeedEntry | null = null;

  loading = this.jobApiService.loadingSignal;
  error = this.jobApiService.errorSignal;

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap(params => {
          const id = params.get('id');
          if (!id) {
            return of(null);
          }
          return this.jobApiService.fetchEntry(id).pipe(
            catchError(() => {
              return of(null);
            })
          );
        })
      )
      .subscribe(entry => {
        this.job = entry;
        if (entry?.ad_content?.description) {
          this.safeDescription = this.sanitizeHtml(entry.ad_content.description);
        }
        if (entry?.ad_content?.employer?.description) {
          this.safeEmployerDescription = this.sanitizeHtml(
            entry.ad_content.employer.description
          );
        }
      });
  }

  sanitizeHtml(html: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
