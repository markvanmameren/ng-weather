import { Injectable } from '@angular/core';
import { AppCache } from '../../types/cache-specific.type';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private static readonly storageKeyPrefix = 'AT-weather-';
  private static readonly storageKeyLocations = LocalStorageService.storageKeyPrefix + 'locations';
  private static readonly storageKeyCache = LocalStorageService.storageKeyPrefix + 'cache';

  readLocations(): string[] {
    const stringifiedZipcodes = localStorage.getItem(LocalStorageService.storageKeyLocations);
    if (stringifiedZipcodes === null) return [];
    const zipcodes: string[] = JSON.parse(stringifiedZipcodes);
    return zipcodes;
  }

  writeLocations(zipcodes: string[]): void {
    const stringifiedZipcodes = JSON.stringify(zipcodes);
    localStorage.setItem(LocalStorageService.storageKeyLocations, stringifiedZipcodes);
  }

  readCache(): AppCache | null {
    const stringifiedCache = localStorage.getItem(LocalStorageService.storageKeyCache);
    if (stringifiedCache === null) return null;
    const cache: AppCache = JSON.parse(stringifiedCache);
    return cache;
  }

  writeCache(cache: AppCache): void {
    const stringifiedCache = JSON.stringify(cache);
    localStorage.setItem(LocalStorageService.storageKeyCache, stringifiedCache);
  }
}
