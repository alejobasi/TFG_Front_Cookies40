import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearGalletaComponent } from './crear-galleta.component';

describe('CrearGalletaComponent', () => {
  let component: CrearGalletaComponent;
  let fixture: ComponentFixture<CrearGalletaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearGalletaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearGalletaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
