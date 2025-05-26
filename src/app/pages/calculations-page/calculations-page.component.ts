import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-calculations-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calculations-page.component.html',
  styleUrl: './calculations-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalculationsPageComponent {}
