import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { SliderModule } from 'primeng/slider';
import { ErrorFormTextPipe } from '../../../pipes/error-form-text.pipe';
import { AuthApiService } from '../../../api/auth.api.service';
import { Subscription, catchError, EMPTY, switchMap, delay } from 'rxjs';
import { Router } from '@angular/router';

export interface IDataModal {}
@Component({
  selector: 'app-nomenclature-modal',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogActions,
    FormsModule,
    MatDialogContent,
    ReactiveFormsModule,
    InputTextModule,
    SliderModule,
    ErrorFormTextPipe,
    CommonModule,
  ],
  templateUrl: './nomenclature-modal.component.html',
  styleUrl: './nomenclature-modal.component.scss',
})
export class NomenclatureModalComponent implements OnInit, OnDestroy {
  readonly dialogRef = inject(MatDialogRef<NomenclatureModalComponent>);
  readonly data = inject<IDataModal>(MAT_DIALOG_DATA);
  readonly authApiService = inject(AuthApiService);
  loading: boolean = false;
  subscriptions: Subscription[] = [];
  fragilityLabels: string[] = ['0', '1', '2', '3', '4', '5'];

  form = new FormGroup({
    article: new FormControl<string>('', Validators.required),
    width: new FormControl<number | null>(null, Validators.required),
    height: new FormControl<number | null>(null, Validators.required),
    depth: new FormControl<number | null>(null, Validators.required),
    barcode: new FormControl<string>('', Validators.required),
    weight: new FormControl<number | null>(null, Validators.required),
    max_layer_height: new FormControl<number | null>(null, Validators.required),
    max_in_layer: new FormControl<number | null>(null, Validators.required),
    fragility: new FormControl<number>(0, Validators.required),
  });
  router: Router = inject(Router);

  get fragilityControl(): FormControl {
    return this.form.get('fragility') as FormControl;
  }

  ngOnInit(): void {}
  /* 
  submit(): void {
    const params = {
      email: this.form.controls.email.value,
      password: this.form.controls.password.value,
    };
    this.loading = true;
    this.subscriptions.push(
      this.authApiService
        .getTokens(params)
        .pipe(
          delay(100),
          switchMap((_tokens) => {
            return this.authApiService.getDataUser();
          }),
          catchError((error) => {
            this.loading = false;
            this.form.setErrors({ serverError: error.error.detail });
            return EMPTY;
          })
        )
        .subscribe((res) => {
          this.loading = false;
          this.authApiService.profile.next(res);
          this.router.navigate(['nomenclature']);
          this.dialogRef.close(true);
          this.form.reset();
        })
    );
  } */

  close(): void {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
