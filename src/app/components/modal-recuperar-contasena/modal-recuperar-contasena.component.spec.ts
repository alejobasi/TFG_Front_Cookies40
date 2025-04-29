import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRecuperarContasenaComponent } from './modal-recuperar-contasena.component';

describe('ModalRecuperarContasenaComponent', () => {
  let component: ModalRecuperarContasenaComponent;
  let fixture: ComponentFixture<ModalRecuperarContasenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalRecuperarContasenaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRecuperarContasenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
