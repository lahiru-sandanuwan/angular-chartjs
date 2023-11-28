import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AnalyticsTabDataService {
  private initialized = false;
  constructor() {}

  setInitialized(): void {
    this.initialized = true;
  }

  isInitialized(): boolean {
    return this.initialized;
  }
}
