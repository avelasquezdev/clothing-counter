import { TestBed } from '@angular/core/testing';

import { ClotheService } from './clothe.service';

describe('ClotheService', () => {
  let service: ClotheService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClotheService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
