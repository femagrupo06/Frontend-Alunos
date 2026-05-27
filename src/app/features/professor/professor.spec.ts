import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessorComponent } from './professor';

describe('ProfessorComponent', () => {
  let component: ProfessorComponent;
  let fixture: ComponentFixture<ProfessorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfessorComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
