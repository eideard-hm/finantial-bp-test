import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  isLoading = signal(false);

  show() {
    this.isLoading.set(true);
  }

  hidden() {
    this.isLoading.set(false);
  }
}
