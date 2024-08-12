import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LocationService } from '../../services/location/location.service';
import { WeatherService } from '../../services/weather/weather.service';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
  standalone: true,
  imports: [RouterLink, DecimalPipe, AsyncPipe]
})
export class CurrentConditionsComponent {
  private router = inject(Router);
  private weatherService = inject(WeatherService);
  private locationService = inject(LocationService);

  currentConditions$ = this.weatherService.currentConditions$;

  showForecast(zipcode: string): void {
    this.router.navigate(['/forecast', zipcode]);
  }

  removeLocation(zipcode: string): void {
    this.locationService.removeLocation(zipcode);
  }

  getIcon(iconId: number): string {
    return this.weatherService.getWeatherIcon(iconId);
  }
}
