import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthApiService } from './api/auth.api.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly authApiService = inject(AuthApiService);
  cookieService = inject(CookieService);
  ngOnInit(): void {
    this.authApiService.restoreSession().subscribe({
      next: (user) => {
        console.log('Session restored successfully:', user);
      },
      error: (error) => {
        console.error('Failed to restore session:', error);
      },
    });
  }
}
