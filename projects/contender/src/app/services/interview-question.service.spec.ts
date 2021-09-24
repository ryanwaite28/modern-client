import { TestBed } from '@angular/core/testing';

import { InterviewQuestionService } from './interview-question.service';

describe('InterviewQuestionService', () => {
  let service: InterviewQuestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterviewQuestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
