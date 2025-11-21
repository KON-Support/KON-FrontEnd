import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardChamado } from './card-chamado';

describe('CardChamado', () => {
  let component: CardChamado;
  let fixture: ComponentFixture<CardChamado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardChamado]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardChamado);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
