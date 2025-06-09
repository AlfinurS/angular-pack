import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NomenclatureModalComponent } from '../../pages/nomenclature-page/nomenclature-modal/nomenclature-modal.component';
import { AuthApiService } from '../../api/auth.api.service';
import { NomenclatureApiService } from '../../api/nomenclature.api.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NgIf, CommonModule } from '@angular/common';
import { Subscription, catchError, of } from 'rxjs';
import { PaginatorModule } from 'primeng/paginator';
import { INomenclature } from '../../types';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-nomenclature-page',
  standalone: true,
  imports: [CommonModule, NgIf, PaginatorModule],
  templateUrl: './nomenclature-page.component.html',
  styleUrl: './nomenclature-page.component.scss',
})
export class NomenclaturePageComponent {
  private subscriptions: Subscription[] = [];
  isAuth: boolean = false;
  loading: boolean = false;
  nomenclatureList: INomenclature[] = [];

  pagination = { page: 1, page_size: 20, total: 0, query: '' };
  constructor(
    private readonly dialog: MatDialog,
    private readonly authService: AuthApiService,
    private readonly nomenclatureApiService: NomenclatureApiService,
    private router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}
  ngOnInit(): void {
    this.subscriptions.push(
      this.authService.profile$.subscribe((profile) => {
        this.isAuth = profile?.is_active ?? false;
        this.cdr.detectChanges();
      })
    );
    this.getNomenclature();
  }

  getNomenclature = async () => {
    this.loading = true;
    this.subscriptions.push(
      this.nomenclatureApiService
        .getNomenclature(this.pagination)
        .pipe(
          catchError((error) => {
            this.loading = false;
            return of(new HttpResponse<INomenclature[]>({ body: [] }));
          })
        )
        .subscribe((response: HttpResponse<INomenclature[]>) => {
          this.loading = false;
          this.nomenclatureList = response.body || [];
          const total = response.headers.get('x-total-count');
          this.pagination.total = total ? +total : 0;
          this.cdr.detectChanges();
        })
    );
  };

  showNomenclatureModal() {
    const dialogRef = this.dialog.open(NomenclatureModalComponent, {
      autoFocus: 'none',
    });
    this.subscriptions.push(
      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
        }
      })
    );
    this.cdr.detectChanges();
  }

  onPageChange = (event: any) => {
    this.pagination.page = event.page + 1;
    this.pagination.page_size = event.rows;
    this.getNomenclature();
  };
}
