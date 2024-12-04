import { DatePipe, NgClass } from '@angular/common';
import { Input, Component } from '@angular/core';
import { FaIconComponent, IconDefinition } from '@fortawesome/angular-fontawesome';
import {
  faBuilding,
  faMapMarkerAlt,
  faCheckCircle,
  faTimesCircle,
  faHeart,
} from '@fortawesome/free-solid-svg-icons';

import { FeedItem } from '../../../core/models';

@Component({
  selector: 'aa-job-listing-card',
  imports: [DatePipe, FaIconComponent, NgClass],
  templateUrl: './job-listing-card.component.html',
  standalone: true,
})
export class JobListingCardComponent {
  @Input() job!: FeedItem;
  faBuilding = faBuilding;
  faMapMarkerAlt = faMapMarkerAlt;
  faCheckCircle = faCheckCircle;
  faTimesCircle = faTimesCircle;
  faHeart = faHeart;

  /**
   * Returns the appropriate icon for the status
   */
  getStatusIcon(): IconDefinition {
    return this.job._feed_entry.status === 'ACTIVE'
      ? this.faCheckCircle
      : this.faTimesCircle;
  }

  /**
   * Returns the appropriate text color class for the status
   */
  getStatusClass(): string {
    return this.job._feed_entry.status === 'ACTIVE'
      ? 'aa--text-accent'
      : 'aa--text-secondary-dark';
  }
}
