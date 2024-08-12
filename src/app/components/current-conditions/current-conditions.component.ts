import { Component, inject, Signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LocationService } from '../../services/location/location.service';
import { WeatherService } from '../../services/weather/weather.service';
import { ConditionsAndZip } from '../../types/conditions-and-zip.type';
import { NgFor, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
  standalone: true,
  imports: [NgFor, RouterLink, DecimalPipe]
})
export class CurrentConditionsComponent {
  private weatherService = inject(WeatherService);
  private router = inject(Router);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> = this.weatherService.getCurrentConditions();

  showForecast(zipcode: string) {
    this.router.navigate(['/forecast', zipcode]);
  }
}
