import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBars, faSun, faMoon, faTimes } from '@fortawesome/free-solid-svg-icons';

import { ThemeService } from '../../../core/services';

@Component({
  selector: 'aa-header',
  imports: [RouterLink, CommonModule, FontAwesomeModule],
  templateUrl: './header.component.html',
  standalone: true,
})
export class HeaderComponent {
  private router = inject(Router);
  protected themeService = inject(ThemeService);

  faBars = faBars;
  faTimes = faTimes;
  faSun = faSun;
  faMoon = faMoon;
  isMenuOpen = false;

  constructor() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isMenuOpen = false;
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    const windowWidth = (event.target as Window).innerWidth;
    if (windowWidth >= 768 && this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }

  toggleTheme(): void {
    this.themeService.toggleDarkMode();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }
}
