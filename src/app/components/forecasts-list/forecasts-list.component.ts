import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map, of, switchMap } from 'rxjs';
import { WeatherService } from '../../services/weather/weather.service';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css'],
  standalone: true,
  imports: [RouterLink, DecimalPipe, DatePipe, AsyncPipe]
})
export class ForecastsListComponent {
  private weatherService = inject(WeatherService);
  private route = inject(ActivatedRoute);

  forecast$ = this.route.paramMap.pipe(
    map((paramMap) => paramMap.get('zipcode')),
    switchMap((zipcode) => (zipcode === null ? of(null) : this.weatherService.getForecast$(zipcode)))
  );

  getIcon(iconId: number): string {
    return this.weatherService.getWeatherIcon(iconId);
  }
}
