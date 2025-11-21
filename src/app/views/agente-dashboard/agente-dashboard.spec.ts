import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgenteDashboard } from './agente-dashboard';

describe('AgenteDashboard', () => {
  let component: AgenteDashboard;
  let fixture: ComponentFixture<AgenteDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgenteDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgenteDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
