import { TestBed } from '@angular/core/testing';

import { EnvironmentLoaderService } from './environmentloader.service';

describe('EnvironmentloaderService', () => {
  let service: EnvironmentLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvironmentLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
