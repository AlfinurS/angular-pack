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
import { Subscription, catchError, EMPTY } from 'rxjs';

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
    contact_info: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required),
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
    };
    this.loading = true;
    this.subscriptions.push(
      this.authApiService
        .getUser(params)
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
