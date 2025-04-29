import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDireccionEntregaComponent } from './modal-direccion-entrega.component';

describe('ModalDireccionEntregaComponent', () => {
  let component: ModalDireccionEntregaComponent;
  let fixture: ComponentFixture<ModalDireccionEntregaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalDireccionEntregaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalDireccionEntregaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
