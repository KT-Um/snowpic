import { TestBed } from '@angular/core/testing';

import { ImageproviderService } from './imageprovider.service';

describe('ImageproviderService', () => {
  let service: ImageproviderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageproviderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
