import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NovoChamadoUser } from './novo-chamado-user';

describe('NovoChamadoUser', () => {
  let component: NovoChamadoUser;
  let fixture: ComponentFixture<NovoChamadoUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NovoChamadoUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NovoChamadoUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
