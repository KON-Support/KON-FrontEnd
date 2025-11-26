import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChamadoDetalhes } from './chamado-detalhes';

describe('ChamadoDetalhes', () => {
  let component: ChamadoDetalhes;
  let fixture: ComponentFixture<ChamadoDetalhes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChamadoDetalhes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChamadoDetalhes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
