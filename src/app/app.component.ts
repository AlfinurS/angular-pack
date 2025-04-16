import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthApiService } from './api/auth.api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly authApiService = inject(AuthApiService);
  ngOnInit(): void {
    this.authApiService.restoreSession().subscribe();
  }
}
