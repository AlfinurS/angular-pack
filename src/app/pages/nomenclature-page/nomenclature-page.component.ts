import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { NomenclatureModalComponent } from '../../pages/nomenclature-page/nomenclature-modal/nomenclature-modal.component';
import { Subscription } from 'rxjs';
import { AuthApiService } from '../../api/auth.api.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NgIf, CommonModule } from '@angular/common';

@Component({
  selector: 'app-nomenclature-page',
  standalone: true,
  imports: [CommonModule, NgIf],
  templateUrl: './nomenclature-page.component.html',
  styleUrl: './nomenclature-page.component.scss',
})
export class NomenclaturePageComponent {
  private subscriptions: Subscription[] = [];
  isAuth: boolean = false;

  constructor(
    private readonly dialog: MatDialog,
    private readonly authService: AuthApiService,
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
  }
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
}
