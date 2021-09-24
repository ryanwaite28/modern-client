import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewAnswersComponent } from './interview-answers.component';

describe('InterviewAnswersComponent', () => {
  let component: InterviewAnswersComponent;
  let fixture: ComponentFixture<InterviewAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewAnswersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
