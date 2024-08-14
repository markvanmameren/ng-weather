import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { combineLatest, interval, map, Observable, shareReplay, startWith, switchMap, tap } from 'rxjs';
import { Current } from '../../types/current.type';
import { Forecast } from '../../types/forecast.type';
import { LocationService } from '../location/location.service';

interface Weather {
  zipcode: string;
  current: Current;
  forecast: Forecast;
}

interface Cache {
  cachedOn: Date;
  weather: Weather[];
}

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  static URL = 'https://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  static MAX_CACHE_DURATION = 60 * 60 * 2 * 1000; // in milliseconds

  private httpClient = inject(HttpClient);
  private locationService = inject(LocationService);

  private refreshCache$ = interval(WeatherService.MAX_CACHE_DURATION).pipe(startWith(0));
  private cache$: Observable<Cache> = combineLatest([this.locationService.locations$, this.refreshCache$]).pipe(
    switchMap(([zipcodes]) => this.getWeather$(zipcodes).pipe(map((weather): Cache => ({ weather, cachedOn: new Date() })))),
    tap(console.log),
    shareReplay(1)
  );

  weather$: Observable<Weather[]> = this.cache$.pipe(map(({ weather }) => weather));

  weatherForZipcode$(zipcode: string): Observable<Weather | null> {
    return this.weather$.pipe(map((weather) => weather.find((weather) => weather.zipcode === zipcode) ?? null));
  }

  private getCurrent$(zipcode: string): Observable<Current> {
    return this.httpClient.get<Current>(`${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`);
  }

  private getForecast$(zipcode: string): Observable<Forecast> {
    return this.httpClient.get<Forecast>(
      `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`
    );
  }

  private getWeatherForZipcode$(zipcode: string): Observable<Weather> {
    return combineLatest([this.getCurrent$(zipcode), this.getForecast$(zipcode)]).pipe(
      map(([current, forecast]): Weather => ({ zipcode, current, forecast }))
    );
  }

  private getWeather$(zipcodes: string[]): Observable<Weather[]> {
    return combineLatest(zipcodes.map((zipcode) => this.getWeatherForZipcode$(zipcode)));
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
