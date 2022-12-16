import { TestBed } from '@angular/core/testing';

import { ContentsControllerService } from './contentsprovider.service';

describe('ImageproviderService', () => {
  let service: ContentsControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentsControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
