import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { NavbarComponent, ToastComponent } from '@shared/components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
