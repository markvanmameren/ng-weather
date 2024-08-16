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
import { Cache } from '../../types/cache.type';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { initialCache } from './initial-cache';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  static CACHE_VALID_DURATION = 2 * 60 * 60 * 1000; // 2 hours in ms
  static CACHE_CHECK_INTERVAL = 10 * 1000; // 10 seconds in ms

  private localStorageService = inject(LocalStorageService);

  private cacheSubject$ = new BehaviorSubject<Cache>(this.initCache());
  private cache$: Observable<Cache> = this.cacheSubject$.pipe(tap((cache) => this.localStorageService.writeCache(cache)));

  private initCache(): Cache {
    return this.localStorageService.readCache() ?? initialCache;
  }

  createCachable$<K extends keyof Cache>({
    cacheKey,
    createFn$,
    validateFn$
  }: {
    cacheKey: K;
    createFn$: () => Observable<Cache[K]['value']>;
    validateFn$: (cached: Cache[K]['value']) => Observable<boolean>;
  }): Observable<Cache[K]['value']> {
    return combineLatest([this.cache$, interval(CacheService.CACHE_CHECK_INTERVAL).pipe(startWith(0))]).pipe(
      map(([cache]) => cache[cacheKey]),
      distinctUntilChanged(isEqual),
      switchMap((cached) => {
        const created$ = createFn$().pipe(tap((created) => this.addToCache<K>(cacheKey, created)));
        if (!this.isValidCache(cached)) return created$;
        return validateFn$(cached.value).pipe(switchMap((isValid) => (isValid ? of(cached.value) : created$)));
      }),
      shareReplay(1)
    );
  }

  private isValidCache<K extends keyof Cache>(cached: Cache[K]): boolean {
    return cached !== undefined && cached.cachedOn !== null && this.now() - cached.cachedOn < CacheService.CACHE_VALID_DURATION;
  }

  private addToCache<K extends keyof Cache>(key: K, value: Cache[K]['value']): void {
    const cached = { cachedOn: this.now(), value };
    const cache: Cache = {
      ...this.cacheSubject$.getValue(),
      [key]: cached
    };
    this.cacheSubject$.next(cache);
  }

  private now(): number {
    return new Date().valueOf();
  }
}
