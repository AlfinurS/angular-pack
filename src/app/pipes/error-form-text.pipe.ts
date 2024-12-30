import { Pipe, PipeTransform, Input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'errorFormText',
  standalone: true,
})
export class ErrorFormTextPipe implements PipeTransform {
  @Input() errorFormTextParams: ValidationErrors | null;
  transform(errors: ValidationErrors | null): string {
    if (errors) {
      if (errors.hasOwnProperty('incorrect')) {
        return errors['incorrect'];
      }
      if (errors.hasOwnProperty('required')) {
        return `Обязательное поле`;
      }
      if (errors.hasOwnProperty('minLength')) {
        return `Минимум ${errors['minLength']} символа`;
      }
      if (errors.hasOwnProperty('maxLength')) {
        return `Максимум ${errors['maxLength']} символа`;
      }
      if (errors.hasOwnProperty('minlength')) {
        // нативные формы ангуляра
        return `Минимум ${errors['minlength'].requiredLength} символа`;
      }
      if (errors.hasOwnProperty('maxlength')) {
        // нативные формы ангуляра
        return `Максимум ${errors['maxlength'].requiredLength} символа`;
      }
      if (errors.hasOwnProperty('min')) {
        return `Значение должно быть больше ${errors['min']}`;
      }
      if (errors.hasOwnProperty('max')) {
        return `Значение должно быть меньше ${errors['max']}`;
      }
      if (errors.hasOwnProperty('pattern')) {
        return `Неверный формат`;
      }
      if (errors.hasOwnProperty('customError')) {
        return errors['customError'];
      }
    }
    return 'Ошибка';
  }
}
