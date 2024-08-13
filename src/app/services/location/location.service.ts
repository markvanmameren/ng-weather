import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { LocalStorageService } from '../local-storage/local-storage.service';

export const storageKey = 'locations';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private localStorageService = inject(LocalStorageService);

  private _locations$ = new BehaviorSubject<string[]>([]);
  locations$ = this._locations$.asObservable().pipe(tap((locations) => this.localStorageService.write(locations)));

  constructor() {
    this._locations$.next(this.localStorageService.read());
  }

  private get locations(): string[] {
    return this._locations$.getValue();
  }

  addLocation(zipcodeToAdd: string) {
    this._locations$.next([...this.locations, zipcodeToAdd]);
  }

  removeLocation(zipcodeToRemove: string) {
    this._locations$.next(this.locations.filter((zipcode) => zipcode !== zipcodeToRemove));
  }
}
