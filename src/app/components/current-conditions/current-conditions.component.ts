import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LocationService } from '../../services/location/location.service';
import { WeatherService } from '../../services/weather/weather.service';
import { Tab, Tabs } from '../../types/tab.type';
import { CurrentCardComponent } from '../current-card/current-card.component';
import { TabsComponent } from '../tabs/tabs.component';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
  standalone: true,
  imports: [AsyncPipe, TabsComponent, CurrentCardComponent]
})
export class CurrentConditionsComponent {
  private weatherService = inject(WeatherService);
  private locationService = inject(LocationService);

  tabs$: Observable<Tabs<typeof CurrentCardComponent>> = this.weatherService.weatherForAllZipcodes$.pipe(
    map((weather) => ({
      componentType: CurrentCardComponent,
      tabs: weather.map(
        ({ zipcode, current }): Tab<typeof CurrentCardComponent> => ({
          componentInputs: { zipcode, current },
          id: zipcode,
          title: `${current.name} (${zipcode})`,
          onClose: () => this.locationService.removeLocation(zipcode)
        })
      )
    }))
  );
}
