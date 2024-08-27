import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { BaseModalComponent } from '../base-modal.component';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from '../../../form/input-text/input-text.component';
import { ButtonComponent } from '../../button/button.component';

@Component({
  selector: 'app-contact-form-modal',
  standalone: true,
  imports: [
    BaseModalComponent,
    InputTextComponent,
    ReactiveFormsModule,
    ButtonComponent,
  ],
  templateUrl: './contact-form-modal.component.html',
  styleUrl: './contact-form-modal.component.scss',
})
export class ContactFormModalComponent implements OnInit {
  @ViewChild('dialog') dialog!: BaseModalComponent;
  @Input() type: 'create' | 'update' = 'update';

  private fb: FormBuilder = new FormBuilder();

  contactForm: FormGroup = this.fb.group({
    first_name: ['', [Validators.required]],
    last_name: ['', Validators.required],
    phone: ['', Validators.required],
    company: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
  });

  submitting: boolean = false;

  initForm: boolean = false;

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.initForm = true;
  }

  openDialog() {
    this.contactForm.reset();
    this.dialog.openDialog();
    this.submitting = false;
  }

  closeDialog() {
    // this.contactForm.emit({
    //   close: true,
    //   submit: false,
    // });
    this.contactForm.reset();
    this.dialog.closeDialog();
    this.submitting = false;
  }

  submitForm() {
    this.contactForm.invalid;
    this.submitting = true;
    if (this.submitting && this.contactForm.invalid) return;
    const dataToSave = this.contactForm.value;
    console.log('dataToSave > ', dataToSave);
  }

  /**
   * To get the column as a FormControl to send that to the app-input or app-textarea of editForm
   * @param columnName
   * @returns FormControl
   */
  getAsFormControl(columnName: string) {
    return this.contactForm.get(columnName) as FormControl;
  }

  /**
   * This validate the age counting 13 years or more
   * @param value the form value using it
   * @returns true if its ok
   */
  validateDateOfBirth(value: any) {
    const birthDate = new Date(value);
    const today = new Date();
    const maxAgeDate = new Date(
      today.getFullYear() - 13,
      today.getMonth(),
      today.getDate(),
    ); // Calculate the date 13 years ago from today
    if (birthDate > maxAgeDate) {
      return false; // Return an error if the date of birth is too recent
    }
    return true;
  }
  isValidDate(date: Date): boolean {
    const today = new Date();
    const maxAgeDate = new Date(
      today.getFullYear() - 13,
      today.getMonth(),
      today.getDate(),
    );
    return date <= maxAgeDate;
  }
}
