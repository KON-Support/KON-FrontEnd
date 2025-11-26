import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChamadoComentarios } from './chamado-comentarios';

describe('ChamadoComentarios', () => {
  let component: ChamadoComentarios;
  let fixture: ComponentFixture<ChamadoComentarios>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChamadoComentarios]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChamadoComentarios);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
