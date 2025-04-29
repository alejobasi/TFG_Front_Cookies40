import { TestBed } from '@angular/core/testing';

import { ComprobacionAdminService } from './comprobacion-admin.service';

describe('ComprobacionAdminService', () => {
  let service: ComprobacionAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComprobacionAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
