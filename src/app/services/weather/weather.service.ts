import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
import { Current } from '../../types/current.type';
import { Forecast } from '../../types/forecast.type';
import { Weather } from '../../types/weather.type';
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

  getWeatherIcon(id: number): string {
    if (id >= 200 && id <= 232) return WeatherService.ICON_URL + 'art_storm.png';
    else if (id >= 501 && id <= 511) return WeatherService.ICON_URL + 'art_rain.png';
    else if (id === 500 || (id >= 520 && id <= 531)) return WeatherService.ICON_URL + 'art_light_rain.png';
    else if (id >= 600 && id <= 622) return WeatherService.ICON_URL + 'art_snow.png';
    else if (id >= 801 && id <= 804) return WeatherService.ICON_URL + 'art_clouds.png';
    else if (id === 741 || id === 761) return WeatherService.ICON_URL + 'art_fog.png';
    else return WeatherService.ICON_URL + 'art_clear.png';
  }

  private getCurrent$ = (zipcode: string): Observable<Current> =>
    this.httpClient.get<Current>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`);

  private getForecast$ = (zipcode: string): Observable<Forecast> =>
    this.httpClient.get<Forecast>(
      `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`
    );

  private getWeatherForZipcode$ = (zipcode: string): Observable<Weather> =>
    combineLatest([this.getCurrent$(zipcode), this.getForecast$(zipcode)]).pipe(
      map(([current, forecast]): Weather => ({ zipcode, current, forecast }))
    );

  private getWeatherForAllZipcodes$ = (zipcodes: string[]): Observable<Weather[]> =>
    combineLatest(zipcodes.map(this.getWeatherForZipcode$));

  weatherForAllZipcodes$: Observable<Weather[]> = this.cacheService.createCachable$({
    cacheKey: 'weather',
    createFn$: () =>
      this.locationService.locations$.pipe(
        switchMap((locations) => (locations.length < 1 ? of([]) : this.getWeatherForAllZipcodes$(locations)))
      ),
    validateFn$: (cached) =>
      this.locationService.locations$.pipe(
        map(
          (locations) =>
            locations.length === cached.length && locations.every((location) => cached.map(({ zipcode }) => zipcode).includes(location))
        )
      )
  });

  weatherForZipcode$ = (zipcode: string): Observable<Weather | null> =>
    this.weatherForAllZipcodes$.pipe(map((weathers) => weathers.find((weather) => weather.zipcode === zipcode) ?? null));
}
