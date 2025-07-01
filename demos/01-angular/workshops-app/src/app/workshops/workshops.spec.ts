import { TestBed } from '@angular/core/testing';

import { Workshops } from './workshops';

describe('Workshops', () => {
  let service: Workshops;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Workshops);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
