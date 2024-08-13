import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { WeatherService } from '../../services/weather/weather.service';
import { CurrentConditions } from '../../types/current-conditions.type';
import { Tabs } from '../../types/tab.type';
import { CurrentConditionComponent } from '../current-condition/current-condition.component';
import { TabsComponent } from '../tabs/tabs.component';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
  standalone: true,
  imports: [AsyncPipe, TabsComponent, CurrentConditionComponent]
})
export class CurrentConditionsComponent {
  private weatherService = inject(WeatherService);

  // TODO - delete
  mockCondition: CurrentConditions = {
    coord: {
      lon: -118.4065,
      lat: 34.0901
    },
    weather: [
      {
        id: 800,
        main: 'Clear',
        description: 'clear sky',
        icon: '01n'
      }
    ],
    base: 'stations',
    main: {
      temp: 66.78,
      feels_like: 66.49,
      temp_min: 63.19,
      temp_max: 70.43,
      pressure: 1012,
      humidity: 71,
      sea_level: 1012,
      grnd_level: 992
    },
    visibility: 10000,
    wind: {
      speed: 4.61,
      deg: 100
    },
    clouds: {
      all: 0
    },
    dt: 1723544999,
    sys: {
      type: 2,
      id: 2012608,
      country: 'US',
      sunrise: 1723554848,
      sunset: 1723603369
    },
    timezone: -25200,
    id: 0,
    name: 'Beverly Hills',
    cod: 200
  };
  mockTabs: Tabs<typeof CurrentConditionComponent> = {
    componentType: CurrentConditionComponent,
    tabs: [
      {
        componentInputs: {
          zipcode: '11423',
          currentCondition: this.mockCondition
        },
        id: '11423',
        title: 'Hollis',
        onClose: () => alert('hoi')
      },
      {
        componentInputs: {
          zipcode: '29576',
          currentCondition: this.mockCondition
        },
        id: '29576',
        title: 'Murrells',
        onClose: () => alert('hoi')
      },
      {
        componentInputs: {
          zipcode: '44122',
          currentCondition: this.mockCondition
        },
        id: '44122',
        title: 'Beachwood',
        onClose: () => alert('hoi')
      }
    ]
  };

  currentConditions$ = this.weatherService.currentConditions$;
}
