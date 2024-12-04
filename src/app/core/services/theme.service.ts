import { Injectable, Renderer2, RendererFactory2, signal } from '@angular/core';

import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private readonly darkClass = 'aa--dark';
  private readonly localStorageKey = 'darkMode';

  isDarkMode = signal(false);

  constructor(
    private localStorageService: LocalStorageService,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.initializeTheme();
  }

  toggleDarkMode(): void {
    const newThemeState = !this.isDarkMode();
    this.isDarkMode.set(newThemeState);
    this.localStorageService.setItem(this.localStorageKey, newThemeState.toString());
    this.updateTheme(newThemeState);
  }

  private initializeTheme(): void {
    const storedTheme = this.localStorageService.getItem(this.localStorageKey);
    const initialTheme =
      storedTheme !== null
        ? storedTheme === 'true'
        : window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.isDarkMode.set(initialTheme);
    this.updateTheme(initialTheme);
  }

  private updateTheme(isDark: boolean): void {
    if (isDark) {
      this.renderer.addClass(document.documentElement, this.darkClass);
    } else {
      this.renderer.removeClass(document.documentElement, this.darkClass);
    }
  }
}
