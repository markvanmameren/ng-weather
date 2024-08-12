import { Component, inject } from '@angular/core';
import { LocationService } from '../../services/location/location.service';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html',
  standalone: true
})
export class ZipcodeEntryComponent {
  private locationService = inject(LocationService);

  addLocation(zipcode: string) {
    this.locationService.addLocation(zipcode);
  }
}
