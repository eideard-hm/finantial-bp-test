import { TestBed } from '@angular/core/testing';

import { BankHttpService } from './bank-http.service';

describe('BankHttpService', () => {
  let service: BankHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BankHttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
