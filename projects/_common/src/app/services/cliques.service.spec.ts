import { TestBed } from '@angular/core/testing';

import { CliquesService } from './cliques.service';

describe('CliquesService', () => {
  let service: CliquesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CliquesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
