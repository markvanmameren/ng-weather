import { Injectable } from '@angular/core';
import { Cache } from '../../types/cache.type';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private static readonly cacheKey = 'ng-weather-cache';

  readZipcodes(): string[] {
    const cache = this.readCache();
    if (cache === null) return [];

    return cache.weather.map(({ zipcode }) => zipcode);
  }

  readCache(): Cache | null {
    const stringifiedCache = localStorage.getItem(LocalStorageService.cacheKey);
    if (stringifiedCache === null) return null;
    const cache: Cache = JSON.parse(stringifiedCache);
    return cache;
  }

  writeCache(cache: Cache): void {
    const stringifiedCache = JSON.stringify(cache);
    localStorage.setItem(LocalStorageService.cacheKey, stringifiedCache);
  }
}
