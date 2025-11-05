import {
  ApplicationConfig,
  inject,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { InitService } from '../core/services/init.service';
import { lastValueFrom, Observable } from 'rxjs';
import { errorInterceptor } from '../core/interceptors/error.interceptor';
import { jwtInterceptorInterceptor } from '../core/interceptors/jwt-interceptor.interceptor';
import { loadingInterceptor } from '../core/interceptors/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(
      withInterceptors([
        errorInterceptor,
        jwtInterceptorInterceptor,
        loadingInterceptor,
      ])
    ),
    provideRouter(routes, withViewTransitions()),
    provideHttpClient(),
    provideAppInitializer(async () => {
      const initService = inject(InitService);

      return new Promise<void>((resolve) => {
        setTimeout(async () => {
          try {
            return lastValueFrom(initService.Init());
          } finally {
            const splash = document.getElementById('initial-splash');
            if (splash) splash.remove();

            resolve();
          }
        }, 500);
      });
    }),
  ],
};
