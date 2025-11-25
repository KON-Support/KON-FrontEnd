import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeusChamadosView } from './meus-chamados-view';

describe('MeusChamadosView', () => {
  let component: MeusChamadosView;
  let fixture: ComponentFixture<MeusChamadosView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeusChamadosView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MeusChamadosView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
