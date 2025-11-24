import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketsUser } from './tickets-user';

describe('TicketsUser', () => {
  let component: TicketsUser;
  let fixture: ComponentFixture<TicketsUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketsUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketsUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
