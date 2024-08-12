import { DatePipe, DecimalPipe, NgFor } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { WeatherService } from '../../services/weather/weather.service';
import { Forecast } from './forecast.type';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css'],
  standalone: true,
  imports: [NgFor, RouterLink, DecimalPipe, DatePipe]
})
export class ForecastsListComponent {
  zipcode!: string;
  forecast!: Forecast;

  private weatherService = inject(WeatherService);
  private route = inject(ActivatedRoute);

  constructor() {
    this.route.params.subscribe((params) => {
      this.zipcode = params['zipcode'];
      this.weatherService.getForecast(this.zipcode).subscribe((data) => (this.forecast = data));
    });
  }

  getIcon(iconId: number): string {
    return this.weatherService.getWeatherIcon(iconId);
  }
}
