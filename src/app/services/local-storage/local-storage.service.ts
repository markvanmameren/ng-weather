import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private static readonly storageKey = 'locations';

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
}
