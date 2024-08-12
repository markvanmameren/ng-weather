import { Injectable } from '@angular/core';
import { WeatherService } from '../weather/weather.service';

export const storageKey = 'locations';

@Injectable()
export class LocationService {
  locations: string[] = [];

  constructor(private weatherService: WeatherService) {
    const locString = localStorage.getItem(storageKey);
    if (locString) this.locations = JSON.parse(locString);
    for (const loc of this.locations) this.weatherService.addCurrentConditions(loc);
  }

  addLocation(zipcode: string) {
    this.locations.push(zipcode);
    localStorage.setItem(storageKey, JSON.stringify(this.locations));
    this.weatherService.addCurrentConditions(zipcode);
  }

  removeLocation(zipcode: string) {
    const index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(storageKey, JSON.stringify(this.locations));
      this.weatherService.removeCurrentConditions(zipcode);
    }
  }
}
