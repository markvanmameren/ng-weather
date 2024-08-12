import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {
  private readonly storageKey = 'locations';

  read(): string[] {
    const stringifiedZipcodes = localStorage.getItem(this.storageKey);
    if (stringifiedZipcodes === null) return [];
    const zipcodes: string[] = JSON.parse(stringifiedZipcodes);
    return zipcodes;
  }

  write(zipcodes: string[]): void {
    const stringifiedZipcodes = JSON.stringify(zipcodes);
    localStorage.setItem(this.storageKey, stringifiedZipcodes);
  }
}
