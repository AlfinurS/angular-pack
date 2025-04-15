import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, filter, from, switchMap } from 'rxjs';
import { testConf } from '../config';
import { AuthApiService } from '../app/api/auth.api.service';
import { CookieService } from 'ngx-cookie-service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookieService = inject(CookieService);
  const baseUrl = testConf.api;
  const token = cookieService.get('access_token');
  let authReq = req.clone({
    url: `${baseUrl}${req.url}`,
    withCredentials: true,
  });
  if (token) {
    authReq = authReq.clone({
      headers: authReq.headers.set('auth-token', token),
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
