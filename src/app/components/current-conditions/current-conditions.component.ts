import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { LocationService } from '../../services/location/location.service';
import { WeatherService } from '../../services/weather/weather.service';
import { Tab, Tabs } from '../../types/tab.type';
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
  private locationService = inject(LocationService);

  tabs$: Observable<Tabs<typeof CurrentConditionComponent>> = this.weatherService.currentConditions$.pipe(
    map((currentConditions) => ({
      componentType: CurrentConditionComponent,
      tabs: currentConditions.map(
        ({ data: currentCondition, zip: zipcode }): Tab<typeof CurrentConditionComponent> => ({
          componentInputs: { zipcode, currentCondition },
          id: zipcode,
          title: `${currentCondition.name} (${zipcode})`,
          onClose: () => this.locationService.removeLocation(zipcode)
        })
      )
    }))
  );
}
