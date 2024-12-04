import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { HeaderComponent, FooterComponent } from './shared/ui';

@Component({
  selector: 'aa-root',
  imports: [RouterOutlet, HeaderComponent, FooterComponent, FontAwesomeModule],
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
