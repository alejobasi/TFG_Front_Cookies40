import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalEditarIngredientesComponent } from './modal-editar-ingredientes.component';

describe('ModalEditarIngredientesComponent', () => {
  let component: ModalEditarIngredientesComponent;
  let fixture: ComponentFixture<ModalEditarIngredientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalEditarIngredientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalEditarIngredientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
