import { DecimalPipe } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LocationService } from '../../services/location/location.service';
import { WeatherService } from '../../services/weather/weather.service';
import { ConditionsAndZip } from '../../types/conditions-and-zip.type';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
  standalone: true,
  imports: [RouterLink, DecimalPipe]
})
export class CurrentConditionsComponent {
  private router = inject(Router);
  private weatherService = inject(WeatherService);
  private locationService = inject(LocationService);
  public currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();

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
