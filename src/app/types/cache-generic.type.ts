export interface Cached<T> {
  cachedOn: number | null;
  value: T;
}

export type GenericCache = Record<string, Record<string, Cached<unknown>>>;
