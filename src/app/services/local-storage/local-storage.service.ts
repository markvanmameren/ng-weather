import { Injectable } from '@angular/core';
import { Cache } from '../../types/cache.type';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private static readonly storageKey = 'ng-weather';
  private static readonly cacheKey = 'ng-weather-cache';

  readZipcodes(): string[] {
    const stringifiedZipcodes = localStorage.getItem(LocalStorageService.storageKey);
    if (stringifiedZipcodes === null) return [];
    const zipcodes: string[] = JSON.parse(stringifiedZipcodes);
    return zipcodes;
  }

  writeZipcodes(zipcodes: string[]): void {
    const stringifiedZipcodes = JSON.stringify(zipcodes);
    localStorage.setItem(LocalStorageService.storageKey, stringifiedZipcodes);
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
