import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSubirImagenComponent } from './modal-subir-imagen.component';

describe('ModalSubirImagenComponent', () => {
  let component: ModalSubirImagenComponent;
  let fixture: ComponentFixture<ModalSubirImagenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSubirImagenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSubirImagenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
