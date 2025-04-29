import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDescripcionProductoComponent } from './modal-descripcion-producto.component';

describe('ModalDescripcionProductoComponent', () => {
  let component: ModalDescripcionProductoComponent;
  let fixture: ComponentFixture<ModalDescripcionProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDescripcionProductoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDescripcionProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
