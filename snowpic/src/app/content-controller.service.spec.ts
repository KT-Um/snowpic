import { TestBed } from '@angular/core/testing';
import { ContentControllerService } from './content-controller.service';

describe('ContentControllerService', () => {
  let service: ContentControllerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContentControllerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
