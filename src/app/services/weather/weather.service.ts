import { inject, Injectable } from '@angular/core';
import { combineLatest, map, Observable, switchMap } from 'rxjs';

import { HttpClient } from '@angular/common/http';
import { Forecast } from '../../components/forecasts-list/forecast.type';
import { CurrentConditions } from '../../types/current-conditions.type';
import { LocationService } from '../location/location.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';

  private httpClient = inject(HttpClient);
  private locationService = inject(LocationService);

  currentConditions$ = this.locationService.locations$.pipe(
    switchMap((zipcodes) => combineLatest(zipcodes.map((zip) => this.getCurrentConditions(zip).pipe(map((data) => ({ zip, data }))))))
  );

  getCurrentConditions(zipcode: string): Observable<CurrentConditions> {
    return this.httpClient.get<CurrentConditions>(
      `${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`
    );
  }

  getForecast(zipcode: string): Observable<Forecast> {
    return this.httpClient.get<Forecast>(
      `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`
    );
  }

  getWeatherIcon(id: number): string {
    if (id >= 200 && id <= 232) return WeatherService.ICON_URL + 'art_storm.png';
    else if (id >= 501 && id <= 511) return WeatherService.ICON_URL + 'art_rain.png';
    else if (id === 500 || (id >= 520 && id <= 531)) return WeatherService.ICON_URL + 'art_light_rain.png';
    else if (id >= 600 && id <= 622) return WeatherService.ICON_URL + 'art_snow.png';
    else if (id >= 801 && id <= 804) return WeatherService.ICON_URL + 'art_clouds.png';
    else if (id === 741 || id === 761) return WeatherService.ICON_URL + 'art_fog.png';
    else return WeatherService.ICON_URL + 'art_clear.png';
  }
}
