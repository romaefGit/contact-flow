import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loggedoutGuard } from './loggedout.guard';

describe('loggedoutGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loggedoutGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
