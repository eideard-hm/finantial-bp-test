import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

@Component({
  selector: 'app-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
  template: `
    <button
      [disabled]="disabled()"
      class="focus:ring-4 focus:outline-none font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
      [type]="type()"
      [ngClass]="colorClass()">
      @if (icon()) {
        <i class="fa-solid fa-regular {{ icon() }} mr-3"></i>
      }
      {{ label() }}
    </button>
  `,
})
export class ButtonComponent {
  label = input<string>();
  icon = input<string>();
  type = input<HTMLButtonElement['type']>('button');
  color = input<Color>('primary');
  disabled = input<boolean>(false);

  protected colorClass = computed(() => this.getColorClass());

  private getColorClass() {
    switch (this.color()) {
      case 'primary':
        return 'bg-yellow-300 hover:bg-yellow-400 focus:ring-yellow-300 text-black';
      case 'secondary':
        return 'bg-gray-400 hover:bg-gray-500 text-black focus:ring-gray-300';
      default:
        return 'bg-blue-500 hover:bg-blue-700 text-white';
    }
  }
}

type Color = 'primary' | 'secondary';
