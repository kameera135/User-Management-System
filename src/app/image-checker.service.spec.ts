import { TestBed } from '@angular/core/testing';

import { ImageCheckerService } from './image-checker.service';

describe('ImageCheckerService', () => {
  let service: ImageCheckerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageCheckerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
