import { NgClass } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

import { FavoriteService } from '../../../core/services';

@Component({
  selector: 'aa-favorite-toggle',
  standalone: true,
  template: `
    <fa-icon
      [icon]="faHeartIcon"
      [ngClass]="{
        'aa--text-accent': isFavorite,
        'aa--text-gray-400': !isFavorite,
      }"
      class="transition-transform aa--cursor-pointer hover:aa--scale-110"
      (click)="toggleFavorite()"
    />
  `,
  imports: [FaIconComponent, NgClass],
})
export class FavoriteToggleComponent implements OnInit {
  private favoriteService = inject(FavoriteService);

  @Input() jobId!: string; // Job ID to manage favorite status
  @Output() favoriteChange = new EventEmitter<boolean>(); // Emits favorite status changes

  isFavorite = false;
  faHeartIcon: IconDefinition = faHeart;

  ngOnInit(): void {
    if (!this.jobId) {
      console.error('FavoriteToggleComponent requires a valid jobId input.');
      return;
    }
    this.isFavorite = this.favoriteService.isFavorite(this.jobId);
  }

  toggleFavorite(): void {
    if (!this.jobId) return;

    if (this.isFavorite) {
      this.favoriteService.removeFavorite(this.jobId);
    } else {
      this.favoriteService.addFavorite(this.jobId);
    }

    this.isFavorite = !this.isFavorite;
    this.favoriteChange.emit(this.isFavorite);
  }
}
