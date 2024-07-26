import { Injectable } from '@angular/core';

import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private confirmationSubject = new Subject<boolean>();
  confirmation$ = this.confirmationSubject.asObservable();

  confirm() {
    this.confirmationSubject.next(true);
  }

  cancel() {
    this.confirmationSubject.next(false);
  }
}
