import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewAnswerComponent } from './interview-answer.component';

describe('InterviewAnswerComponent', () => {
  let component: InterviewAnswerComponent;
  let fixture: ComponentFixture<InterviewAnswerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterviewAnswerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterviewAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
