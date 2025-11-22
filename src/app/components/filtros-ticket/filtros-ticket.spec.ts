import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosTicket } from './filtros-ticket';

describe('FiltrosTicket', () => {
  let component: FiltrosTicket;
  let fixture: ComponentFixture<FiltrosTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosTicket]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrosTicket);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
