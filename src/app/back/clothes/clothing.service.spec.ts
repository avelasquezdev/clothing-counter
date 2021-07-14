import { TestBed } from '@angular/core/testing';

import { ClothingService } from './clothing.service';

describe('ClothingService', () => {
  let service: ClothingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClothingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
