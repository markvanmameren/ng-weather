import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LocationService } from '../../services/location/location.service';
import { WeatherService } from '../../services/weather/weather.service';
import { Tab, Tabs } from '../../types/tab.type';
import { CurrentComponent } from '../current/current.component';
import { TabsComponent } from '../tabs/tabs.component';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
  standalone: true,
  imports: [AsyncPipe, TabsComponent, CurrentComponent]
})
export class CurrentConditionsComponent {
  private weatherService = inject(WeatherService);
  private locationService = inject(LocationService);

  tabs$: Observable<Tabs<typeof CurrentComponent>> = this.weatherService.weather$.pipe(
    map((weather) => ({
      componentType: CurrentComponent,
      tabs: weather.map(
        ({ zipcode, current }): Tab<typeof CurrentComponent> => ({
          componentInputs: { zipcode, current },
          id: zipcode,
          title: `${current.name} (${zipcode})`,
          onClose: () => this.locationService.removeLocation(zipcode)
        })
      )
    }))
  );
}
