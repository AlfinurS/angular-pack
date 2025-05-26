import { Component, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AuthModalComponent } from '../../components/auth-modal/auth-modal.component';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
  subscriptions: Subscription[] = [];

  constructor(
    private readonly dialog: MatDialog,
    private readonly cdr: ChangeDetectorRef
  ) {}

  showLoginModal() {
    const dialogRef = this.dialog.open(AuthModalComponent, {
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

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
