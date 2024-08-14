import { Current } from './current.type';
import { Forecast } from './forecast.type';

export interface Weather {
  zipcode: string;
  current: Current;
  forecast: Forecast;
}
