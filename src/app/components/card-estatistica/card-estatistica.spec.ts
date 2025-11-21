import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardEstatistica } from './card-estatistica';

describe('CardEstatistica', () => {
  let component: CardEstatistica;
  let fixture: ComponentFixture<CardEstatistica>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardEstatistica]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardEstatistica);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
