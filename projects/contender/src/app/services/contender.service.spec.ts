import { TestBed } from '@angular/core/testing';

import { ContenderService } from './contender.service';

describe('ContenderService', () => {
  let service: ContenderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContenderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
