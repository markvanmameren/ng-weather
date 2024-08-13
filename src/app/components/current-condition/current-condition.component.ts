import { DecimalPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { WeatherService } from '../../services/weather/weather.service';
import { CurrentConditions } from '../../types/current-conditions.type';

@Component({
  selector: 'app-current-condition',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './current-condition.component.html',
  styleUrl: './current-condition.component.css'
})
export class CurrentConditionComponent {
  private router = inject(Router);
  private weatherService = inject(WeatherService);

  zipcode = input.required<string>();
  currentCondition = input.required<CurrentConditions>();

  showForecast(): void {
    this.router.navigate(['/forecast', this.zipcode()]);
  }

  getIcon(iconId: number): string {
    return this.weatherService.getWeatherIcon(iconId);
  }
}
