import { Weather } from './weather.type';

export interface Cached<T> {
  cachedOn: number | null;
  value: T;
}

export interface Cache {
  weather: Cached<Weather[]>;
}
