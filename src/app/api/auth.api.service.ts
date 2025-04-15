import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthResponse, userType } from '../types';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  constructor(private readonly http: HttpClient) {}
  public profile: BehaviorSubject<userType | null> =
    new BehaviorSubject<userType | null>(null);

  cookieService = inject(CookieService);
  token: string | null = null;
  refreshToken: string | null = null;

  get isAuth(): boolean {
    return Boolean(this.profile?.value?.email);
  }

  getTokens(params: object): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('api/auth/login', params).pipe(
      tap((response: AuthResponse) => {
        this.token = response.access_token;
        this.refreshToken = response.refresh_token;
        this.cookieService.set(
          'access_token',
          this.token,
          undefined,
          '/',
          '',
          false,
          'Lax'
        );
        this.cookieService.set(
          'refresh_token',
          this.refreshToken,
          undefined,
          '/',
          '',
          true,
          'Lax'
        );
      })
    );
  }

  getDataUser(): Observable<userType> {
    return this.http.get<userType>('api/auth/me');
  }

  userRegistration(params: object): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('api/auth/register', params);
  }
}
