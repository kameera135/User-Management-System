import { TestBed } from '@angular/core/testing';

import { AssertTreeService } from './assert-tree.service';

describe('AssertTreeService', () => {
  let service: AssertTreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssertTreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
