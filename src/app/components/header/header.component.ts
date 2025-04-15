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
import { AuthApiService } from '../../api/auth.api.service';
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
  private subscriptions: Subscription[] = [];
  isAuth: boolean = false;

  constructor(
    private readonly dialog: MatDialog,
    private readonly authService: AuthApiService,
    private router: Router,
    private readonly cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isAuth = this.authService.isAuth;
    this.handleLocation(this.router.url);

    this.subscriptions.push(
      this.router.events.subscribe((event) => {
        if (event instanceof GuardsCheckEnd) {
          this.handleLocation(event.url);
        }
      })
    );

    this.subscriptions.push(
      this.authService.profile.subscribe((profile) => {
        this.isAuth = !!profile;
        this.cdr.detectChanges();
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

  logout(): void {
    this.authService.profile.next(null);
    this.authService.token = null;
    this.authService.refreshToken = null;
    this.router.navigate(['home-page']);
  }

  handleLocation(url: string): void {
    this.isHomePage = url === 'home-page';
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
