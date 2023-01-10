import { TestBed } from '@angular/core/testing';

import { EventHandlerService } from './event-handler.service';

describe('EventHandlerService', () => {
  let service: EventHandlerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EventHandlerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
