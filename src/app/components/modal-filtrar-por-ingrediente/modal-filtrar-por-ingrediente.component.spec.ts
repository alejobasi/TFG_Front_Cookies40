import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalFiltrarPorIngredienteComponent } from './modal-filtrar-por-ingrediente.component';

describe('ModalFiltrarPorIngredienteComponent', () => {
  let component: ModalFiltrarPorIngredienteComponent;
  let fixture: ComponentFixture<ModalFiltrarPorIngredienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalFiltrarPorIngredienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalFiltrarPorIngredienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
