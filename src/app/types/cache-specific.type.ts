import { Cached, GenericCache } from './cache-generic.type';
import { Current } from './current.type';
import { Forecast } from './forecast.type';

export interface AppCache extends GenericCache {
  current: Record<string, Cached<Current>>;
  forecast: Record<string, Cached<Forecast>>;
}
