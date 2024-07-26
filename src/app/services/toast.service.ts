import { Injectable, signal } from '@angular/core';
import { ToastType } from '@products/models';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private timeOut!: NodeJS.Timeout;

  showToast = signal(false);
  toastOption = signal({
    type: 'info' as ToastType,
    message: '',
  });

  showAlert(type: ToastType, message: string) {
    this.toastOption.set({
      type,
      message,
    });
    this.showToast.set(true);

    this.toastTimer();
  }

  private toastTimer() {
    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => {
      this.showToast.set(false);
    }, 5000);
  }
}
