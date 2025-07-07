import { TestBed } from '@angular/core/testing';
import { WorskhopsService } from './worskhops.service';

import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

describe('WorskhopsService', () => {
  let service: WorskhopsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), provideHttpClient()],
    });
    service = TestBed.inject(WorskhopsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
