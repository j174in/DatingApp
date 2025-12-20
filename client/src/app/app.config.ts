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
      // Used while for initial app intilization for injecting data. Wil run before
      // the app is initialized.
      const initService = inject(InitService);

      return new Promise<void>((resolve) => {
        setTimeout(async () => {
          try {
            return lastValueFrom(initService.Init());
            //lastValueFrom converts an observable to a promise returning the last value
            //from the stream of observable output
            //You can also use the FirstValueFrom() with it
            //toPromise() is deprecated.
          } finally {
            const splash = document.getElementById('initial-splash');
            if (splash) splash.remove();

            resolve();

            //resolve is called to tell the javascript that the promise has been complete.
            //even if there was an error in the try
            //this would ensure that always the app gets intiailzed even if there was
            //an error and ensure the splash screen is gone.
            //this is not always neccessary.
          }
        }, 500);
      });
    }),
  ],
};
