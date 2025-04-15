import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { IErrorModalData } from '../types';

@Injectable({
  providedIn: 'root',
})
export class ErrorsService {
  showError$ = new Subject<IErrorModalData>();

  getErrorText(error: HttpErrorResponse): string {
    if (error?.error && typeof error.error === 'string') {
      return error.error;
    } else {
      return error.statusText;
    }
  }
}
