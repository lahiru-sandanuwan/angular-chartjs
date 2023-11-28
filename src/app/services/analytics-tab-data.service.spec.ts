import { TestBed } from '@angular/core/testing';

import { AnalyticsTabDataService } from './analytics-tab-data.service';

describe('AnalyticsTabDataService', () => {
  let service: AnalyticsTabDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnalyticsTabDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
