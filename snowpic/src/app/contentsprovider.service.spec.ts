import { TestBed } from '@angular/core/testing';

import { ContentsProviderService } from './contentsprovider.service';

describe('ImageproviderService', () => {
  let service: ContentsProviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentsProviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
