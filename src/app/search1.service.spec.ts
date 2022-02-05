import { TestBed } from '@angular/core/testing';

import { Search1Service } from './search1.service';

describe('Search1Service', () => {
  let service: Search1Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Search1Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
