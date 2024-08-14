import { Weather } from './weather.type';

export interface Cache {
  cachedOn: number;
  weather: Weather[];
}
