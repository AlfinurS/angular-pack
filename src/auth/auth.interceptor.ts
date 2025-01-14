import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, filter, from, switchMap } from 'rxjs';
import { testConf } from '../config';
import { AuthApiService } from '../app/api/auth.api.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authApiService = inject(AuthApiService);
  const baseUrl = testConf.api;
  let authReq = req.clone({
    url: `${baseUrl}${req.url}`,
  });
  if (authApiService.token) {
    authReq = authReq.clone({
      headers: authReq.headers.set('auth-token', authApiService.token),
    });
  }
  return next(authReq).pipe(
    catchError((err) => {
      if (err) {
        switch (err.status) {
          case 401:
            console.log('logout');
        }
      }
      throw err;
    })
  );
};
