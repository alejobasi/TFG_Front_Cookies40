import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SorteoDescuentoComponent } from './sorteo-descuento.component';

describe('SorteoDescuentoComponent', () => {
  let component: SorteoDescuentoComponent;
  let fixture: ComponentFixture<SorteoDescuentoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SorteoDescuentoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SorteoDescuentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
