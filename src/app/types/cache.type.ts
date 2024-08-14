import { Weather } from './weather.type';

export interface Cache {
  cachedOn: Date;
  weather: Weather[];
}
