import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  GuardsCheckEnd,
  Router,
  RouterLink,
  ActivatedRoute,
} from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
/* import { AuthService } from '../../auth/auth.service'; */
import { AuthModalComponent } from '../../components/auth-modal/auth-modal.component';
import { RegistrationModalComponent } from '../../components/registration-modal/registration-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isHomePage: boolean = true;
  public isProfilePage: boolean = false;
  private subscriptions: Subscription[] = [];
  isAuth: boolean = false;

  constructor(
    private readonly dialog: MatDialog,
    //private authService: AuthService,
    private router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    //this.profile = this.authService.profile.getValue();
    this.handleLocation(this.router.url);

    this.subscriptions.push(
      this.router.events.subscribe((event) => {
        if (event instanceof GuardsCheckEnd) {
          this.handleLocation(event.url);
        }
      })
    );
  }

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

  showRegistrationModal() {
    const dialogRef = this.dialog.open(RegistrationModalComponent, {
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

  handleLocation(url: string): void {
    this.isHomePage = url === '/';
    this.isProfilePage = url === '/profile';
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
