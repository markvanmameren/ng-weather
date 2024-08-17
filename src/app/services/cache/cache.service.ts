import { inject, Injectable } from '@angular/core';
import { isEqual } from 'lodash';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  interval,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap,
  tap
} from 'rxjs';
import { Cached } from '../../types/cache-generic.type';
import { AppCache } from '../../types/cache-specific.type';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { initialCache } from './initial-cache';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  static CACHE_VALID_DURATION = 2 * 60 * 60 * 1000; // 2 hours in ms
  static CACHE_CHECK_INTERVAL = 10 * 1000; // 10 seconds in ms

  private localStorageService = inject(LocalStorageService);

  private cacheSubject$ = new BehaviorSubject<AppCache>(this.initCache());
  private cache$: Observable<AppCache> = this.cacheSubject$.pipe(tap((cache) => this.localStorageService.writeCache(cache)));

  private initCache(): AppCache {
    return this.localStorageService.readCache() ?? initialCache;
  }

  useCache<CacheKey extends keyof AppCache, Id extends keyof AppCache[CacheKey]>({
    cacheKey,
    id,
    createFn$
  }: {
    cacheKey: CacheKey;
    id: Id;
    createFn$: () => Observable<AppCache[CacheKey][Id]['value']>;
  }) {
    return combineLatest([this.cache$, interval(CacheService.CACHE_CHECK_INTERVAL).pipe(startWith(0))]).pipe(
      map(([cache]) => cache[cacheKey][id]),
      switchMap((cached) =>
        this.isValidCache(cached)
          ? of(cached.value)
          : createFn$().pipe(tap((created) => this.addToCache<CacheKey, Id>(cacheKey, id, created)))
      ),
      distinctUntilChanged(isEqual),
      shareReplay(1)
    );
  }

  private addToCache<CacheKey extends keyof AppCache, Id extends keyof AppCache[CacheKey]>(
    cacheKey: CacheKey,
    id: Id,
    created: AppCache[CacheKey][Id]['value']
  ): void {
    const prevCache = this.cacheSubject$.getValue();
    const cache: AppCache = {
      ...prevCache,
      [cacheKey]: {
        ...prevCache[cacheKey],
        [id]: { cachedOn: this.now(), value: created }
      }
    };
    this.cacheSubject$.next(cache);
  }

  private isValidCache<T>(cached: Cached<T>): boolean {
    return cached !== undefined && cached.cachedOn !== null && this.now() - cached.cachedOn < CacheService.CACHE_VALID_DURATION;
  }

  private now(): number {
    return new Date().valueOf();
  }
}
