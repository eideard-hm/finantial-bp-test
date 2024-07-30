import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';

import { LoadingService } from '@services';

@Component({
  standalone: true,
  selector: 'app-loader',
  template: `
    @if (isLoading()) {
      <section
        class="fixed w-full h-full bg-[rgba(74,74,74,.35)] z-[1000000] flex justify-center items-center">
        <div class="lds-ring">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </section>
    } @else {
      <ng-container />
    }
  `,
  styleUrl: './loader.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  private readonly _spinnerSvc = inject(LoadingService);

  isLoading = signal(false);

  constructor() {
    effect(() => {
      const isLoading = this._spinnerSvc.isLoading();
      untracked(() => this.isLoading.set(isLoading));
    });
  }
}
