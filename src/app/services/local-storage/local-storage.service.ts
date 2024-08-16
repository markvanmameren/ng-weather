import { Injectable } from '@angular/core';
import { Cache } from '../../types/cache.type';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private static readonly storageKeyCache = 'ng-weather-cache';

  readCache(): Cache | null {
    const stringifiedCache = localStorage.getItem(LocalStorageService.storageKeyCache);
    if (stringifiedCache === null) return null;
    const cache: Cache = JSON.parse(stringifiedCache);
    return cache;
  }

  writeCache(cache: Cache): void {
    const stringifiedCache = JSON.stringify(cache);
    localStorage.setItem(LocalStorageService.storageKeyCache, stringifiedCache);
  }

  readLocations(): string[] {
    return this.readCache()?.weather.value.map((weather) => weather.zipcode) ?? [];
  }
}
