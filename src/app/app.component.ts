import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { FooterComponent } from './shared/ui/footer/footer.component';
import { HeaderComponent } from './shared/ui/header/header.component';

@Component({
  selector: 'aa-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  standalone: true,
  template: `
    <div class="content">
      <aa-header />
      <div class="main-content">
        <main><router-outlet /></main>
        <aa-footer />
      </div>
    </div>
  `,
  styleUrl: './app.component.scss',
})
export class AppComponent {}
