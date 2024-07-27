import type {
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';

import { map, type Observable, of } from 'rxjs';

import type { FinancialService } from '@products/services/financial.service';

export function asyncIdValidator(
  financialSvc: FinancialService
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }
    return financialSvc
      .productIdExists(control.value)
      .pipe(map(existsId => (existsId ? { existsID: true } : null)));
  };
}
