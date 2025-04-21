import { Component, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { MatCheckbox } from '@angular/material/checkbox';
import { ThemePalette } from '@angular/material/core';
import { ErrorMessageComponent } from '../../ui/error-message/error-message.component';
//     };

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [FormsModule, MatCheckbox, ErrorMessageComponent],
  templateUrl: './checkbox.component.html',
})
export class CheckboxComponent implements ControlValueAccessor {
  @Input() color: ThemePalette;
  checked: boolean = false;
  disabled: boolean = false;
  onChange: Function = () => {};
  onTouch: Function = () => {};

  constructor(protected control: NgControl) {
    control.valueAccessor = this;
  }

  onModelChange(checked: boolean): void {
    this.checked = checked;
    this.onChange(checked);
    this.control.control?.setValue(checked);
  }

  registerOnChange(fn: Function): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onTouch = fn;
  }

  writeValue(checked: boolean): void {
    this.checked = checked;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
