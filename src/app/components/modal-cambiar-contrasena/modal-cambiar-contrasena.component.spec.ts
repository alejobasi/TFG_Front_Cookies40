import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCambiarContrasenaComponent } from './modal-cambiar-contrasena.component';

describe('ModalCambiarContrasenaComponent', () => {
  let component: ModalCambiarContrasenaComponent;
  let fixture: ComponentFixture<ModalCambiarContrasenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCambiarContrasenaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCambiarContrasenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
