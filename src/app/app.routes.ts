import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home/home.component').then(m => m.HomeComponent),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./features/favorites/favorites.component').then(m => m.FavoritesComponent),
  },
  {
    path: 'job/:id',
    loadComponent: () =>
      import('./features/job-listing-details/job-listing-details.component').then(
        m => m.JobListingDetailsComponent
      ),
  },
  { path: '**', redirectTo: '' },
];
