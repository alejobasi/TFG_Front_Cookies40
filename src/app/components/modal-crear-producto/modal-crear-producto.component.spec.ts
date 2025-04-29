import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCrearProductoComponent } from './modal-crear-producto.component';

describe('ModalCrearProductoComponent', () => {
  let component: ModalCrearProductoComponent;
  let fixture: ComponentFixture<ModalCrearProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalCrearProductoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCrearProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
