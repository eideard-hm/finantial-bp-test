import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { of, type Observable } from 'rxjs';

import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class HandleHttpErrorsService {
  private readonly _toastSvc = inject(ToastService);

  handleHttpError<T>(
    alertMessage: string,
    defaultValue: T,
    error?: HttpErrorResponse
  ): Observable<T> {
    console.log({ error });
    switch (error?.status) {
      case 0: {
        this._toastSvc.showAlert(
          'error',
          'No se pudo establecer conexión con el servidor, por favor revise su conexión a internet.'
        );
        break;
      }

      case 400: {
        this._toastSvc.showAlert(
          'error',
          'Los datos enviados no son válidos. Por favor, verifique.'
        );
        break;
      }

      case 500: {
        this._toastSvc.showAlert(
          'error',
          'Ocurrió un error en nuestros servicios, por favor intente más tarde.'
        );
        break;
      }

      default: {
        this._toastSvc.showAlert('error', alertMessage);
        break;
      }
    }

    return of(defaultValue);
  }
}
