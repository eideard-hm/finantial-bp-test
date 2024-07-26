import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import type { IDropdownOption } from '@shared/models';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DropdownComponent {
  label = input<string>();
  icon = input<string>();
  options = input<IDropdownOption[]>([]);

  // models
  isOpen = signal<boolean>(false);

  protected toggleDropdown(): void {
    this.isOpen.set(!this.isOpen());
  }
}
