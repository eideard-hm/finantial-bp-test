import { inject, Injectable } from '@angular/core';

import { map, type Observable } from 'rxjs';

import type { IFinancialData, IFinancialResponse } from '@products/models';
import { BankHttpService } from '@services';

/**
 * Servicio para obtener los datos financieros de un usuario.
 */
@Injectable({
  providedIn: 'root',
})
export class FinancialService {
  private readonly _http = inject(BankHttpService);

  /**
   * Obtiene los datos financieros de un usuario.
   * @returns
   */
  retrieveFinancialData(): Observable<IFinancialData[]> {
    return this._http
      .get<IFinancialResponse>('products')
      .pipe(map(response => response.data));
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
  createProduct(product: IFinancialData): Observable<IFinancialData> {
    return this._http.post<IFinancialData, IFinancialData>('products', product);
  }
}
