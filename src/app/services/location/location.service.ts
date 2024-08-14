import { inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalStorageService } from '../local-storage/local-storage.service';

export const storageKey = 'locations';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private localStorageService = inject(LocalStorageService);

  private _locations$ = new BehaviorSubject<string[]>([]);
  locations$ = this._locations$.asObservable();

  constructor() {
    this._locations$.next(this.localStorageService.readZipcodes());
  }

  private get locations(): string[] {
    return this._locations$.getValue();
  }

  addLocation(zipcodeToAdd: string): void {
    if (this.locations.includes(zipcodeToAdd)) return;

    this._locations$.next([...this.locations, zipcodeToAdd]);
  }

  removeLocation(zipcodeToRemove: string): void {
    if (!this.locations.includes(zipcodeToRemove)) return;

    this._locations$.next(this.locations.filter((zipcode) => zipcode !== zipcodeToRemove));
  }
}
