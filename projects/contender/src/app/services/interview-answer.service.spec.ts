import { TestBed } from '@angular/core/testing';

import { InterviewAnswerService } from './interview-answer.service';

describe('InterviewAnswerService', () => {
  let service: InterviewAnswerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterviewAnswerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
