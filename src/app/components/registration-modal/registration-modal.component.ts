import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
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
import { Subscription, catchError, EMPTY } from 'rxjs';

export interface IDataModal {}
@Component({
  selector: 'app-registration-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogTitle,
    MatDialogActions,
    FormsModule,
    MatDialogContent,
    ReactiveFormsModule,
    InputTextModule,
    ErrorFormTextPipe,
  ],
  templateUrl: './registration-modal.component.html',
  styleUrl: './registration-modal.component.scss',
})
export class RegistrationModalComponent implements OnInit, OnDestroy {
  readonly dialogRef = inject(MatDialogRef<RegistrationModalComponent>);
  readonly data = inject<IDataModal>(MAT_DIALOG_DATA);
  readonly authApiService = inject(AuthApiService);
  loading: boolean = false;
  subscriptions: Subscription[] = [];

  passValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }
    if (this.form.controls.password.value !== control.value) {
      return { customError: 'Пароли должны совпадать' };
    }
    return null;
  };

  form = new FormGroup({
    contact_info: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required),
    repeatPassword: new FormControl<string>('', [
      Validators.required,
      this.passValidator,
    ]),
  });

  ngOnInit(): void {}

  close(): void {
    this.dialogRef.close();
  }

  submit(): void {
    //const params = this.form.value;
    const params = {
      contact_info: this.form.controls.contact_info.value,
      password: this.form.controls.password.value,
      repeatPassword: this.form.controls.repeatPassword.value,
    };
    this.loading = true;
    this.subscriptions.push(
      this.authApiService
        .userRegistration(params)
        .pipe(
          catchError(() => {
            this.loading = false;
            return EMPTY;
          })
        )
        .subscribe((res) => {
          this.dialogRef.close(true);
          this.form.reset();
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
