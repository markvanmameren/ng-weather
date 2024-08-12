import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { WeatherService } from '../weather/weather.service';

export const storageKey = 'locations';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private weatherService = inject(WeatherService);
  private localStorageService = inject(LocalStorageService);

  locations: string[] = [];

  constructor() {
    this.locations = this.localStorageService.read();
    for (const loc of this.locations) this.weatherService.addCurrentConditions(loc);
  }

  addLocation(zipcode: string) {
    this.locations.push(zipcode);
    this.localStorageService.write(this.locations);
    this.weatherService.addCurrentConditions(zipcode);
  }

  removeLocation(zipcode: string) {
    const index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      this.localStorageService.write(this.locations);
      this.weatherService.removeCurrentConditions(zipcode);
    }
  }
}
