import { Component, forwardRef, Input, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './input-text.component.html',
  styleUrl: './input-text.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextComponent),
      multi: true,
    },
  ],
})
export class InputTextComponent {
  @Input() errorTitle = 'This field is required.';
  @Input() errorMessage = '';

  @Input() errorMessages: {
    [key: string]: any;
  } = {};

  @Input() title = '';
  @Input() id = '';
  @Input() type = 'text'; // Set a valid default value like 'text'

  @Input() control: FormControl = new FormControl();

  @Input() autocomplete = 'off';
  @Input() accept = '';
  @Input() subtitle?: string;
  @Input() value?: string;
  @Input() titleClass?: string;
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() inputClass = '';
  @Input() errorClass: string = '';

  @Input() max: any;
  @Input() min: any;

  errorClasses = 'border border-semantic-100';

  initClasses = () => {};

  addErrorClasses = () => {};

  ngOnInit() {
    this.initClasses();
  }

  getErrors(): string[] {
    if (!this.control || !this.control.errors) {
      return [];
    }

    if (this.control?.getError('minlength')) {
      const requiredLength =
        this.control?.getError('minlength')['requiredLength'];

      this.errorMessages = {
        ...this.errorMessages,
        minlength: `This field can't have less than ${requiredLength} characters`,
      };
    }

    if (this.control?.getError('maxlength')) {
      const requiredLength =
        this.control?.getError('maxlength')['requiredLength'];
      this.errorMessages = {
        ...this.errorMessages,
        maxlength: `This field can't have over ${requiredLength} characters`,
      };
    }

    this.errorMessages = {
      required: 'This field is required',
      ...this.errorMessages,
    };

    return Object.keys(this.control.errors);
  }
}
