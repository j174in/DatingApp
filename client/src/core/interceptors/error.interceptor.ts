import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { NavigationExtras, Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // used to intercet http reuest and responses before they reach their location.
  const toastService = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (error) {
        switch (error.status) {
          case 400:
            if (error.error.errors) {
              const modelStateError = [];
              for (const key in error.error.errors) {
                if (error.error.errors[key]) {
                  modelStateError.push(error.error.errors[key]);
                }
              }

              throw modelStateError.flat();
            } else {
              toastService.error(error.error);
            }
            break;
          case 401:
            toastService.error('UnAuthorized');
            break;
          case 404:
            router.navigateByUrl('not-found');
            toastService.error('Not Found');
            break;
          case 500:
            //navigation extras
            // only gets access inside a comonent constructor
            const navigationExtras: NavigationExtras = {
              state: { error: error.error },
            };
            router.navigateByUrl('server-error', navigationExtras);
            toastService.error('Internal Server Error');
            break;
          default:
            toastService.error('Something is not right');
            break;
        }
      }

      throw error;
    })
  );
};
