import { TestBed } from '@angular/core/testing';

import { ContactActiveService } from './contact-active.service';

describe('ContactActiveService', () => {
  let service: ContactActiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactActiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
