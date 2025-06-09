import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  catchError,
  of,
  switchMap,
  throwError,
} from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthResponse, IPagination, INomenclature } from '../types';

interface IInitData {
  article: string;
  depth: number | null;
  width: number | null;
  height: number | null;
  weight: number | null;
  barcode: string;
  fragility: number | null;
  max_layer_height: number | null;
  max_in_layer: number | null;
}

@Injectable({
  providedIn: 'root',
})
export class NomenclatureApiService {
  constructor(private readonly http: HttpClient) {}

  createNomenclature(params: IInitData): Observable<INomenclature[]> {
    return this.http.post<INomenclature[]>('api/nomenclature/', params).pipe(
      tap((response: INomenclature[]) => {
        console.log('Nomenclature created:', response);
      })
    );
  }
  getNomenclature = (
    params?: IPagination
  ): Observable<HttpResponse<INomenclature[]>> => {
    let url = 'api/nomenclature/';
    if (params) {
      url = `${url}?page=${params.page}&page_size=${params.page_size}&query=${params.query}`;
    } else {
      url = url + '?page_size=100';
    }

    return this.http.get<INomenclature[]>(url, { observe: 'response' }).pipe(
      tap((res) => {
        console.log('Headers:', res.headers);
        console.log('Body:', res.body);
      })
    );
  };
}
