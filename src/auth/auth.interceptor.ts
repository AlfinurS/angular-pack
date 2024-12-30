import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, filter, from, switchMap } from 'rxjs';
import { testConf } from '../config';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = testConf.api;
  const authReq = req.clone({
    url: `${baseUrl}${req.url}`,
    //headers: req.headers.set('Authorization', `Bearer${authToken}`),
  });
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
