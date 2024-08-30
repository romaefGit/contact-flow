import { Component, inject } from '@angular/core';
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
import { Session } from '../../../core/models/session.model';
import { MessageModalComponent } from '../../../components/user-interface/base-modal/message-modal/message-modal.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputTextComponent,
    RouterLink,
    ButtonComponent,
    MessageModalComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private sessionService = inject(SessionService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);

  public loginForm!: FormGroup;
  public isSubmitted = false;

  serverMessage: any = {
    type: 'success',
    message: 'Success operation',
  };

  constructor() {}

  ngOnInit(): void {
    this.formatLoginForm();
  }

  formatLoginForm() {
    this.loginForm = this.formBuilder.group({
      email: [''],
      password: [''],
    });
  }

  submitForm() {
    this.isSubmitted = true;

    const user: UserImpl = this.loginForm.getRawValue();

    if (this.loginForm.valid) {
      this.sessionService.login(user).subscribe({
        next: (response: Session) => {
          this.router.navigate(['contacts']);
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
    return this.loginForm.get(columnName) as FormControl;
  }
}
