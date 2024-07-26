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

      // case 400: {
      //   this._alertSvc.dialogAccept({
      //     title: 'Resultado de la transacción',
      //     message: message || alertMessage,
      //     handleConfirm: () => {},
      //     textConfirm: 'Cerrar',
      //   });
      //   break;
      // }

      // case 401: {
      //   this.handle401Response();
      //   break;
      // }

      // case 403: {
      //   this.forbidenAccess();
      //   break;
      // }

      // case 500: {
      //   this._alertSvc.dialogAccept({
      //     title: 'Error en el servidor',
      //     message:
      //       'Actualmente, tenemos problemas con nuestros servicios, comuníquese con el administrador del sistema para más información.',
      //     handleConfirm: () => {},
      //   });
      //   break;
      // }

      // default: {
      //   this._alertSvc.dialogAccept({
      //     title: 'Error inesperado',
      //     message:
      //       'Ocurrió un error inesperado con nuestros servicios, por favor intente más tarde.',
      //     handleConfirm: () => {},
      //   });

      //   break;
      // }
    }

    return of(defaultValue);
  }
}
