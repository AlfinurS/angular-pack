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
import { NomenclatureApiService } from '../../../api/nomenclature.api.service';
import { Subscription, catchError, EMPTY, switchMap, delay } from 'rxjs';

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
  styleUrls: ['./nomenclature-modal.component.scss'],
})
export class NomenclatureModalComponent implements OnInit, OnDestroy {
  readonly dialogRef = inject(MatDialogRef<NomenclatureModalComponent>);
  readonly data = inject<IDataModal>(MAT_DIALOG_DATA);
  readonly nomenclatureApiService = inject(NomenclatureApiService);

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

  get fragilityControl(): FormControl {
    return this.form.get('fragility') as FormControl;
  }

  ngOnInit(): void {}

  submit(): void {
    const params = {
      article: this.form.controls.article.value ?? '',
      width: this.form.controls.width.value,
      height: this.form.controls.height.value,
      depth: this.form.controls.depth.value,
      barcode: this.form.controls.barcode.value ?? '',
      weight: this.form.controls.weight.value,
      max_layer_height: this.form.controls.max_layer_height.value,
      max_in_layer: this.form.controls.max_in_layer.value,
      fragility: this.form.controls.fragility.value,
    };
    this.loading = true;
    this.subscriptions.push(
      this.nomenclatureApiService
        .createNomenclature(params)
        .pipe(
          delay(100),
          catchError((error) => {
            this.loading = false;
            this.form.setErrors({
              serverError: error?.error?.detail || 'Ошибка сервера',
            });
            return EMPTY;
          })
        )
        .subscribe(() => {
          this.loading = false;
          this.dialogRef.close(true);
          this.form.reset();
        })
    );
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
