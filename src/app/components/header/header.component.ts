import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { GuardsCheckEnd, Router, RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthApiService } from '../../api/auth.api.service';
import { AuthModalComponent } from '../../components/auth-modal/auth-modal.component';
import { userType } from '../../types';
import { RegistrationModalComponent } from '../../components/registration-modal/registration-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isHomePage: boolean = true;
  public isAuth: boolean = false;
  public user: userType | null = null;
  private subscriptions: Subscription[] = [];

  showPopover = false;
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
      this.authService.profile$.subscribe((profile) => {
        this.isAuth = !!profile;
        this.user = profile;
        this.cdr.detectChanges();
      })
    );
  }

  showLoginModal() {
    const dialogRef = this.dialog.open(AuthModalComponent, {
      autoFocus: 'none',
    });
    this.subscriptions.push(dialogRef.afterClosed().subscribe());
    this.cdr.detectChanges();
  }

  showRegistrationModal() {
    const dialogRef = this.dialog.open(RegistrationModalComponent, {
      autoFocus: 'none',
    });
    this.subscriptions.push(dialogRef.afterClosed().subscribe());
    this.cdr.detectChanges();
  }

  showChangePasswordModal() {
    // показать модальное окно
  }

  logout(): void {
    this.authService.logout();
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
