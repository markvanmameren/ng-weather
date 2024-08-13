import { Component } from '@angular/core';
import { CurrentConditionsComponent } from '../current-conditions/current-conditions.component';
import { TabsComponent } from '../tabs/tabs.component';
import { ZipcodeEntryComponent } from '../zipcode-entry/zipcode-entry.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  standalone: true,
  styleUrl: './main-page.component.css',
  imports: [ZipcodeEntryComponent, CurrentConditionsComponent, TabsComponent]
})
export class MainPageComponent {}
