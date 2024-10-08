import { DecimalPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { WeatherService } from '../../services/weather/weather.service';
import { Current } from '../../types/current.type';

@Component({
  selector: 'app-current-card',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './current-card.component.html',
  styleUrl: './current-card.component.css'
})
export class CurrentCardComponent {
  private router = inject(Router);
  private weatherService = inject(WeatherService);

  zipcode = input.required<string>();
  current = input.required<Current>();

  showForecast(): void {
    this.router.navigate(['/forecast', this.zipcode()]);
  }

  getIcon(iconId: number): string {
    return this.weatherService.getWeatherIcon(iconId);
  }
}
