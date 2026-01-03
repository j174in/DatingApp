import { HttpEvent, HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { BusyService } from '../services/busy.service';
import { inject } from '@angular/core';
import { delay, finalize, identity, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';

const cache = new Map<string, HttpEvent<unknown>>();

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const busyService = inject(BusyService);

  const generateCacheKey = (url: string, params: HttpParams): string => {
    const paramString = params
      .keys()
      .map((key) => `${key} = ${params.get(key)}`)
      .join('&');

    // console.log(url);
    // console.log(paramString);
    return paramString ? `${url}?${paramString}` : url;
  };
  //map is a callback function

  const invalidateCache = (urlPattern: string) => {
    //const key in cache.keys() maps over the properities of the object not the
    //iterator
    for (const key of cache.keys()) {
      if (key.includes(urlPattern)) {
        cache.delete(key);
      }
    }
  };

  const cacheKey = generateCacheKey(req.url, req.params);

  if (req.method.includes('POST') && req.url.includes('/likes')) {
    invalidateCache('/likes');
  }

  if (req.method.includes('POST') && req.url.includes('/messages')) {
    invalidateCache('/messages');
  }

  if (req.method.includes('POST') && req.url.includes('/logout')) {
    cache.clear();
  }

  if (req.method === 'GET') {
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse) {
      return of(cachedResponse);
    }
  }

  busyService.busy();

  return next(req).pipe(
    environment.production ? identity : delay(500),
    tap((response) => cache.set(cacheKey, response)),
    finalize(() => {
      busyService.idle();
    })
  );
};
