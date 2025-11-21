import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsUrgentes } from './tickets-urgentes';

describe('TicketsUrgentes', () => {
  let component: TicketsUrgentes;
  let fixture: ComponentFixture<TicketsUrgentes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketsUrgentes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketsUrgentes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
