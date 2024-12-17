import { Component } from '@angular/core';

import { CollapsibleListComponent } from './collapsible-list/collapsible-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CollapsibleListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'test-app';
}
