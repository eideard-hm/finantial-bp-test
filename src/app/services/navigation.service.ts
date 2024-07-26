import { inject, Injectable, NgZone } from '@angular/core';
import { type NavigationExtras, Router } from '@angular/router';

/**
 * Servicio para manejar las navegaciones
 */
@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private readonly _router = inject(Router);
  private readonly _ngZone = inject(NgZone);

  public navigateTo(path: string[], extras?: NavigationExtras): void {
    this._ngZone.run(() => this._router.navigate(path, extras));
  }
}
