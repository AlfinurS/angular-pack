import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserLoginResponse } from '../types';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  constructor(private readonly http: HttpClient) {}

  getUser(params: object): Observable<UserLoginResponse> {
    return this.http.post<UserLoginResponse>('login/', params);
  }

  userRegistration(params: object): Observable<any> {
    return this.http.post<any>('/register/', params);
  }
}
