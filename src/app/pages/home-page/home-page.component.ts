import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import {
  ChangeDetectionStrategy,
  Component,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { HomeApiService } from '../../api/home.api.service';
import { Subscription } from 'rxjs';
import {
  GuardsCheckEnd,
  Router,
  RouterLink,
  ActivatedRoute,
} from '@angular/router';
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
    private router: Router,
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
