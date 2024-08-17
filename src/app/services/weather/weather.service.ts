import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { Current } from '../../types/current.type';
import { Forecast } from '../../types/forecast.type';
import { CacheService } from '../cache/cache.service';
import { LocationService } from '../location/location.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';

  private httpClient = inject(HttpClient);
  private cacheService = inject(CacheService);
  private locationService = inject(LocationService);

  allCurrent$: Observable<{ zipcode: string; current: Current }[]> = this.locationService.locations$.pipe(
    switchMap((zipcodes) =>
      zipcodes.length > 0
        ? combineLatest(zipcodes.map((zipcode) => this.getCurrent$(zipcode).pipe(map((current) => ({ zipcode, current })))))
        : of([])
    )
  );

  getWeatherIcon(id: number): string {
    if (id >= 200 && id <= 232) return WeatherService.ICON_URL + 'art_storm.png';
    else if (id >= 501 && id <= 511) return WeatherService.ICON_URL + 'art_rain.png';
    else if (id === 500 || (id >= 520 && id <= 531)) return WeatherService.ICON_URL + 'art_light_rain.png';
    else if (id >= 600 && id <= 622) return WeatherService.ICON_URL + 'art_snow.png';
    else if (id >= 801 && id <= 804) return WeatherService.ICON_URL + 'art_clouds.png';
    else if (id === 741 || id === 761) return WeatherService.ICON_URL + 'art_fog.png';
    else return WeatherService.ICON_URL + 'art_clear.png';
  }

  getCurrent$ = (zipcode: string): Observable<Current> =>
    this.cacheService.useCache({
      cacheKey: 'current',
      id: zipcode,
      createFn$: () =>
        this.httpClient.get<Current>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`)
    });

  getForecast$ = (zipcode: string): Observable<Forecast> =>
    this.cacheService.useCache({
      cacheKey: 'forecast',
      id: zipcode,
      createFn$: () =>
        this.httpClient.get<Forecast>(
          `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`
        )
    });
}
