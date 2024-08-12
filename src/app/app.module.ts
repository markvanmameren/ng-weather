import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { CurrentConditionsComponent } from './components/current-conditions/current-conditions.component';
import { ForecastsListComponent } from './components/forecasts-list/forecasts-list.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ZipcodeEntryComponent } from './components/zipcode-entry/zipcode-entry.component';
import { LocationService } from './services/location/location.service';
import { WeatherService } from './services/weather/weather.service';

@NgModule({
  declarations: [AppComponent, ZipcodeEntryComponent, ForecastsListComponent, CurrentConditionsComponent, MainPageComponent],
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(routes)],
  providers: [LocationService, WeatherService, provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule {}
