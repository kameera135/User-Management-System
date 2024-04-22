import { TestBed } from '@angular/core/testing';

import { MenutreeService } from './menutree.service';

describe('MenutreeService', () => {
  let service: MenutreeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenutreeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
