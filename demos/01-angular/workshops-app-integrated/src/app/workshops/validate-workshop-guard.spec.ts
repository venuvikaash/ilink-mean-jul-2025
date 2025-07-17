import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { validateWorkshopGuard } from './validate-workshop-guard';

describe('validateWorkshopGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => validateWorkshopGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
