import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovoTicket } from './novo-ticket';

describe('NovoTicket', () => {
  let component: NovoTicket;
  let fixture: ComponentFixture<NovoTicket>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovoTicket]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovoTicket);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
