import { inject, Injectable } from '@angular/core';

import { catchError, map, tap, type Observable } from 'rxjs';

import type { IFinancialData, IFinancialResponse } from '@products/models';
import {
  BankHttpService,
  HandleHttpErrorsService,
  ToastService,
} from '@services';

/**
 * Servicio para obtener los datos financieros de un usuario.
 */
@Injectable({
  providedIn: 'root',
})
export class FinancialService {
  private readonly _http = inject(BankHttpService);
  private readonly _handleHttpErrorsSvc = inject(HandleHttpErrorsService);
  private readonly _toastSvc = inject(ToastService);

  /**
   * Obtiene los datos financieros de un usuario.
   * @returns
   */
  retrieveFinancialData(): Observable<IFinancialData[]> {
    return this._http
      .get<IFinancialResponse<IFinancialData[]>>('products')
      .pipe(
        map(response => response.data),
        catchError(err =>
          this._handleHttpErrorsSvc.handleHttpError(
            'No se pudo obtener los productos financieros',
            [],
            err
          )
        )
      );
  }

  retrieveFinancialDataById(id: number): Observable<IFinancialData> {
    return this._http.get<IFinancialData>(`products/${id}`);
  }

  /**
   * Valida si un id de producto existe.
   * @param id
   * @returns
   */
  existsProduct(id: number): Observable<boolean> {
    return this._http.get(`products/${id}`);
  }

  /**
   * Crear un nuevo producto.
   * @param product
   * @returns
   */
  createProduct(
    product: IFinancialData
  ): Observable<IFinancialResponse<IFinancialData> | undefined> {
    return this._http
      .post<
        IFinancialData,
        IFinancialResponse<IFinancialData>
      >('products', product)
      .pipe(
        tap(data => {
          this._toastSvc.showAlert('success', data.message);
        }),
        catchError(err =>
          this._handleHttpErrorsSvc.handleHttpError(
            'No se pudo crear el producto. Por favor verifique los datos ingresados.',
            undefined,
            err
          )
        )
      );
  }
}
