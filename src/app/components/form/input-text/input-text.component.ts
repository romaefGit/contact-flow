import {
  Component,
  forwardRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { InfoMessageComponent } from '../../user-interface/info-message/info-message.component';

@Component({
  selector: 'app-input-text',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InfoMessageComponent],
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
  @Input() subtitle?: string;
  @Input() value?: string;
  @Input() placeholder = '';
  @Input() disabled = false;
  @Input() sentErrorOutside = false;

  @Input() max: any;
  @Input() min: any;

  @Output() errorOutMessage = new EventEmitter<any>();

  getErrors(): string[] {
    if (!this.control || !this.control.errors) {
      this.errorOutMessage.emit(null);
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

    if (this.control?.getError('email')) {
      this.errorMessages = {
        ...this.errorMessages,
        email: `You need to set a valid email`,
      };
    }

    if (this.control?.getError('pattern')) {
      this.errorMessages = {
        ...this.errorMessages,
        pattern: `The input format is invalid.`,
      };
    }

    this.errorMessages = {
      required: 'This field is required',
      ...this.errorMessages,
    };

    if (this.sentErrorOutside && this.control.errors) {
      this.errorOutMessage.emit(this.errorMessages);
    }

    return Object.keys(this.control.errors);
  }
}
