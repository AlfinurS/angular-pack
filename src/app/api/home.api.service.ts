import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { IUploadResponse } from '../types';

@Injectable({
  providedIn: 'root',
})
export class HomeApiService {
  constructor(private readonly http: HttpClient) {}

  uploadFiles(formData: FormData): Observable<IUploadResponse> {
    return this.http.post<any>('documents/upload/', formData);
  }
}
