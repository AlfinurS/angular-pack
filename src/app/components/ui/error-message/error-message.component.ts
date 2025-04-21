import { Component, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { MatError } from '@angular/material/form-field';
import { ErrorFormTextPipe } from '../../../pipes/error-form-text.pipe';

@Component({
  selector: 'app-error-message',
  standalone: true,
  imports: [MatError, ErrorFormTextPipe],
  templateUrl: './error-message.component.html',
})
export class ErrorMessageComponent {
  @Input({ required: true }) errors: ValidationErrors | null;
  @Input({ required: true }) dirty: boolean;
}
