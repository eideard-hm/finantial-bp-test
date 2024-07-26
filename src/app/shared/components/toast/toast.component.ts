import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';

import { ToastService } from '@services';

@Component({
  selector: 'app-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass],
  template: `
    @if (showToast()) {
      <div
        class="fixed bottom-0 right-0 m-4 p-4 rounded-lg shadow-lg z-50"
        [ngClass]="toastClasses()">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <span class="text-xl mr-2">{{ toastIcon() }}</span>
            <span class="font-medium">{{ toastOption().message }}</span>
          </div>
        </div>
      </div>
    }
  `,
})
export class ToastComponent {
  private readonly _toastSvc = inject(ToastService);

  showToast = this._toastSvc.showToast;
  toastOption = this._toastSvc.toastOption;

  protected toastClasses = computed(() => this.getClasses());
  protected toastIcon = computed(() => this.getIcon());

  private getClasses() {
    switch (this.toastOption().type) {
      case 'success':
        return 'text-green-800 bg-green-50';
      case 'error':
        return 'text-red-800 bg-red-50';
      case 'warning':
        return 'text-yellow-800 bg-yellow-50';
      case 'info':
        return 'text-blue-800 bg-blue-50';
      default:
        return 'text-blue-800 bg-blue-50';
    }
  }

  private getIcon() {
    switch (this.toastOption().type) {
      case 'success':
        return '🎉';
      case 'error':
        return '😢';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return 'ℹ️';
    }
  }
}
