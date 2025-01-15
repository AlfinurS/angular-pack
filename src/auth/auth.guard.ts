import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthApiService } from '../app/api/auth.api.service';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const authApiService = inject(AuthApiService);
  if (authApiService.isAuth) {
    return true;
  }
  return inject(Router).createUrlTree(['home-page']);
};
