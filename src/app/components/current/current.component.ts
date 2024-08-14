import { DecimalPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { WeatherService } from '../../services/weather/weather.service';
import { Current } from '../../types/current.type';

@Component({
  selector: 'app-current',
  standalone: true,
  imports: [DecimalPipe, RouterLink],
  templateUrl: './current.component.html',
  styleUrl: './current.component.css'
})
export class CurrentComponent {
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
