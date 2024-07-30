import type {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';

import { finalize, type Observable } from 'rxjs';

import { LoadingService } from '@services';

export const loaderInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const loadingSvc = inject(LoadingService);
  loadingSvc.show();
  return next(request).pipe(finalize(() => loadingSvc.hidden()));
};
