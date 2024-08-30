import { Component, OnInit, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { UserImpl } from '../../../core/models/user.model';
import { InputTextComponent } from '../../../components/form/input-text/input-text.component';
import { Router, RouterLink } from '@angular/router';
import { ButtonComponent } from '../../../components/user-interface/button/button.component';
import { SessionService } from '../../../core/services/user/session/session.service';
import { MessageModalComponent } from '../../../components/user-interface/base-modal/message-modal/message-modal.component';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextComponent,
    RouterLink,
    ButtonComponent,
    MessageModalComponent,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  private sessionService = inject(SessionService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  public signupForm!: FormGroup;
  public isSubmitted = false;

  serverMessage: any = {
    type: 'success',
    message: 'Success operation',
  };

  constructor() {}

  ngOnInit(): void {
    this.formatReactiveForm();
  }

  formatReactiveForm() {
    this.signupForm = this.formBuilder.group({
      name: [''],
      email: [''],
      password: [''],
    });
  }

  submitForm() {
    this.isSubmitted = true;

    const user: UserImpl = this.signupForm.getRawValue();

    if (this.signupForm.valid) {
      this.sessionService.register(user).subscribe({
        next: (response: UserImpl) => {
          this.serverMessage.type = 'success';
          this.serverMessage.message = 'Yor account was created successfully!';
          setTimeout(() => {
            this.router.navigate(['/auth/login']);
          }, 2000);
        },
        error: (error: any) => {
          this.serverMessage.type = 'error';
          this.serverMessage.message = error?.message;
          throw new Error(error);
        },
      });
    } else {
      throw new Error('Form error');
    }
  }

  /**
   * Retrieves a specific form control from the contact form based on the column name.
   * This method is useful for binding the form control to custom input or textarea components.
   * @param columnName The name of the form control to retrieve.
   * @returns The FormControl corresponding to the given `columnName`.
   */
  getAsFormControl(columnName: string) {
    return this.signupForm.get(columnName) as FormControl;
  }
}
