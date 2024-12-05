import { inject, Injectable } from '@angular/core';

import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private localStorageService = inject(LocalStorageService);
  private readonly FAVORITES_KEY = 'FAVORITES';

  /**
   * Adds a job to favorites.
   * @param {string} jobId
   */
  addFavorite(jobId: string): void {
    const favorites = this.getFavorites();
    if (!favorites.includes(jobId)) {
      favorites.push(jobId);
      this.localStorageService.setItem(this.FAVORITES_KEY, favorites);
      console.log(`Added to favorites: ${jobId}`);
    }
  }

  /**
   * Removes a job from favorites.
   * @param {string} jobId
   */
  removeFavorite(jobId: string): void {
    const favorites = this.getFavorites().filter(id => id !== jobId);
    this.localStorageService.setItem(this.FAVORITES_KEY, favorites);
    console.log(`Removed from favorites: ${jobId}`);
  }

  /**
   * Checks if a job is in favorites.
   * @param {string} jobId
   * @return {boolean}
   */
  isFavorite(jobId: string): boolean {
    return this.getFavorites().includes(jobId);
  }

  /**
   * Gets the list of favorite job IDs.
   * @return {string[]}
   */
  getFavorites(): string[] {
    const favorites = this.localStorageService.getItem(this.FAVORITES_KEY);
    return Array.isArray(favorites) ? favorites : [];
  }
}
