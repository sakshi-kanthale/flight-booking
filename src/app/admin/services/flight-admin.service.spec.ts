import { TestBed } from '@angular/core/testing';

import { FlightAdminService } from './flight-admin.service';

describe('FlightAdminService', () => {
  let service: FlightAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FlightAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
