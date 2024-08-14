import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { combineLatest, interval, map, Observable, of, shareReplay, startWith, switchMap, tap } from 'rxjs';
import { Cache } from '../../types/cache.type';
import { Current } from '../../types/current.type';
import { Forecast } from '../../types/forecast.type';
import { Weather } from '../../types/weather.type';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { LocationService } from '../location/location.service';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  static CACHE_CHECK_INTERVAL = 10 * 1000; // 10 seconds in ms
  static CACHE_VALID_DURATION = 2 * 60 * 60 * 1000; // 2 hours in ms

  private httpClient = inject(HttpClient);
  private locationService = inject(LocationService);
  private localStorageService = inject(LocalStorageService);

  private cache$: Observable<Cache> = combineLatest([
    this.locationService.locations$,
    interval(WeatherService.CACHE_CHECK_INTERVAL).pipe(startWith(0))
  ]).pipe(
    switchMap(([zipcodes]) => {
      const cache = this.localStorageService.readCache();
      console.log(`cache check - ${this.isCacheValid(cache, zipcodes) ? 'VALID' : 'INVALID'}`, cache);
      return this.isCacheValid(cache, zipcodes) ? of(cache) : this.createCache$(zipcodes);
    }),
    shareReplay(1)
  );

  weather$: Observable<Weather[]> = this.cache$.pipe(map(({ weather }) => weather));

  createCache$(zipcodes: string[]): Observable<Cache> {
    return this.getWeather$(zipcodes).pipe(
      map((weather): Cache => ({ weather, cachedOn: this.now() })),
      tap((cache) => this.localStorageService.writeCache(cache))
    );
  }

  weatherForZipcode$(zipcode: string): Observable<Weather | null> {
    return this.weather$.pipe(map((weather) => weather.find((weather) => weather.zipcode === zipcode) ?? null));
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

  private now(): number {
    return new Date().valueOf();
  }

  private getCurrent$(zipcode: string): Observable<Current> {
    return this.httpClient.get<Current>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`);
  }

  private getForecast$(zipcode: string): Observable<Forecast> {
    return this.httpClient.get<Forecast>(
      `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`
    );
  }

  private getWeather$(zipcodes: string[]): Observable<Weather[]> {
    return combineLatest(
      zipcodes.map((zipcode) =>
        combineLatest([this.getCurrent$(zipcode), this.getForecast$(zipcode)]).pipe(
          map(([current, forecast]): Weather => ({ zipcode, current, forecast }))
        )
      )
    );
  }

  private isCacheValid(cache: Cache | null, zipcodes: string[]): cache is Cache {
    return (
      cache !== null &&
      this.now() - cache.cachedOn < WeatherService.CACHE_VALID_DURATION &&
      cache.weather.length === zipcodes.length &&
      cache.weather.every(({ zipcode }) => zipcodes.includes(zipcode))
    );
  }
}
