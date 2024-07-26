import {
  HttpClient,
  type HttpHeaders,
  type HttpParams,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import type { Observable } from 'rxjs';

import { environment } from '@env/environment.development';

/**
 * Servicio para realizar peticiones HTTP a la API del banco.
 */
@Injectable({
  providedIn: 'root',
})
export class BankHttpService {
  private readonly _http = inject(HttpClient);
  private readonly baseURL: string = `${environment.apiUrl}/bp`;

  // Método GET
  get<T>(
    endpoint: string,
    params?: HttpParams,
    headers?: HttpHeaders
  ): Observable<T> {
    return this._http.get<T>(`${this.baseURL}/${endpoint}`, {
      params,
      headers,
    });
  }

  // Método POST
  post<T, R>(endpoint: string, body: T, headers?: HttpHeaders): Observable<R> {
    return this._http.post<R>(`${this.baseURL}/${endpoint}`, body, { headers });
  }

  // Método PUT
  put<T, R>(endpoint: string, body: T, headers?: HttpHeaders): Observable<R> {
    return this._http.put<R>(`${this.baseURL}/${endpoint}`, body, { headers });
  }

  // Método DELETE
  delete<T>(
    endpoint: string,
    params?: HttpParams,
    headers?: HttpHeaders
  ): Observable<T> {
    return this._http.delete<T>(`${this.baseURL}/${endpoint}`, {
      params,
      headers,
    });
  }
}
