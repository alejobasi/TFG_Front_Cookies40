import { TestBed } from '@angular/core/testing';

import { PedidoComunicacionServiceService } from './pedido-comunicacion-service.service';

describe('PedidoComunicacionServiceService', () => {
  let service: PedidoComunicacionServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PedidoComunicacionServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
