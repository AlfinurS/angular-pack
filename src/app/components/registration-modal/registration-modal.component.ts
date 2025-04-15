import {
  Component,
  inject,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
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
  MatDialog,
} from '@angular/material/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ErrorFormTextPipe } from '../../pipes/error-form-text.pipe';
import { AuthApiService } from '../../api/auth.api.service';
import { Subscription, catchError, EMPTY, switchMap } from 'rxjs';
import { AuthModalComponent } from '../../components/auth-modal/auth-modal.component';

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
  readonly dialog = inject(MatDialog);
  readonly data = inject<IDataModal>(MAT_DIALOG_DATA);
  readonly authApiService = inject(AuthApiService);
  readonly cdr = inject(ChangeDetectorRef);
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
    email: new FormControl<string>('', Validators.required),
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
    const params = {
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
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
          this.loading = false;
          this.dialogRef.close(true);
          this.showLoginModal();
          this.form.reset();
        })
    );
  }

  showLoginModal(): void {
    const dialogAuthRef = this.dialog.open(AuthModalComponent, {
      autoFocus: 'none',
    });
    this.subscriptions.push(
      dialogAuthRef.afterClosed().subscribe((res) => {
        if (res) {
          console.log(res);
        }
      })
    );
    this.cdr.detectChanges();
  }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
