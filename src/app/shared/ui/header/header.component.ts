import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'aa-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  standalone: true,
})
export class HeaderComponent {
  isMenuOpen = false;

  constructor(public themeService: ThemeService) {}

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
