import { TestBed } from '@angular/core/testing';

import { EnvironmentloaderService } from './environmentloader.service';

describe('EnvironmentloaderService', () => {
  let service: EnvironmentloaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvironmentloaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
