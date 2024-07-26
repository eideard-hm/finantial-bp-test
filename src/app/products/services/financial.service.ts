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

  retrieveFinancialData(): Observable<IFinancialData[]> {
    return this._http
      .get<IFinancialResponse>('products')
      .pipe(map(response => response.data));
  }
}
