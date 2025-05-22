import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorFormTextPipe } from '../../pipes/error-form-text.pipe';
import { AuthApiService } from '../../api/auth.api.service';
import {
  Subscription,
  catchError,
  EMPTY,
  switchMap,
  delay,
  tap,
  finalize,
} from 'rxjs';
import { Router } from '@angular/router';
import { CheckboxComponent } from '../../components/ui/checkbox/checkbox.component';
import { LoginParams } from '../../types';

export interface IDataModal {}
@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogActions,
    FormsModule,
    MatDialogContent,
    ReactiveFormsModule,
    InputTextModule,
    ErrorFormTextPipe,
    CheckboxComponent,
  ],
  templateUrl: './auth-modal.component.html',
  styleUrl: './auth-modal.component.scss',
})
export class AuthModalComponent implements OnInit, OnDestroy {
  readonly dialogRef = inject(MatDialogRef<AuthModalComponent>);
  readonly data = inject<IDataModal>(MAT_DIALOG_DATA);
  readonly authApiService = inject(AuthApiService);
  loading: boolean = false;
  subscriptions: Subscription[] = [];

  form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    rememberMe: new FormControl(false, { nonNullable: true }),
  });
  router: Router = inject(Router);

  ngOnInit(): void {}

  submit(): void {
    if (this.form.invalid) return;

    const params: LoginParams = {
      email: this.form.controls.email.value ?? '',
      password: this.form.controls.password.value ?? '',
      rememberMe: this.form.controls.rememberMe.value ?? false,
    };
    this.loading = true;

    const login$ = this.authApiService.getTokens(params).pipe(
      delay(100),
      switchMap(() => this.authApiService.getDataUser()),
      tap((user) => {
        if (user) {
          this.router.navigate(['nomenclature']);
          this.dialogRef.close(true);
          this.form.reset();
        } else {
          throw new Error('User data not found');
        }
      }),
      catchError((error) => {
        this.form.setErrors({
          serverError: error?.error?.detail || 'Ошибка входа',
        });
        return EMPTY;
      }),
      finalize(() => {
        this.loading = false;
      })
    );
    this.subscriptions.push(login$.subscribe());
  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
