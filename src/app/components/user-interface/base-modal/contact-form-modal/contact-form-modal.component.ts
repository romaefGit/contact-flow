import { Component, OnInit, ViewChild, Input, inject } from '@angular/core';
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
import { Observable } from 'rxjs';
import { ContactsService } from '../../../../core/services/contacts/contacts.service';
import { Contacts } from '../../../../core/models/contacts.model';
import { DropdownComponent } from '../../../form/dropdown/dropdown.component';
import { TypesService } from '../../../../core/services/types/types.service';
import { Type, Types } from '../../../../core/models/types.model';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-contact-form-modal',
  standalone: true,
  imports: [
    BaseModalComponent,
    InputTextComponent,
    ReactiveFormsModule,
    ButtonComponent,
    DropdownComponent,
    AsyncPipe,
  ],
  templateUrl: './contact-form-modal.component.html',
  styleUrl: './contact-form-modal.component.scss',
})
export class ContactFormModalComponent implements OnInit {
  @ViewChild('dialog') dialog!: BaseModalComponent;
  @Input() type: 'create' | 'update' = 'update';

  contactForm!: FormGroup;

  private fb: FormBuilder = inject(FormBuilder);

  private readonly contactsService = inject(ContactsService);
  private readonly typesService = inject(TypesService);
  typesList: Types = [];

  submitting: boolean = false;
  initForm: boolean = false;
  serverErrorMessage: string = '';

  phonePattern = /^\+?\d{10,15}$/; // Accepts '+573214567896' or '3214567896'
  wordPattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/; // words only

  ngOnInit(): void {
    this.typesService.getTypes().subscribe({
      next: (types) => {
        console.log('types > ', types);

        this.typesList = types;
      },
    });
    this.contactForm = this.fb.group({
      first_name: [
        '',
        [Validators.required, Validators.pattern(this.wordPattern)],
      ],
      last_name: ['', Validators.pattern(this.wordPattern)],
      phone: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
      phone_type: [''],
      company: ['', Validators.pattern(this.wordPattern)],
      email: ['', [Validators.email]],
      notes: ['', Validators.pattern(this.wordPattern)],
    });

    this.initForm = true;
  }

  openDialog() {
    this.submitting = false;
    this.contactForm.reset();
    this.dialog.openDialog();
  }

  closeDialog() {
    this.submitting = false;
    this.contactForm.reset();
    this.dialog.closeDialog();
  }

  submitForm() {
    this.markAllControlsAsTouched(this.contactForm);
    const dataToSave = this.contactForm.value;
    console.log('this.contactForm.invalid > ', this.contactForm.invalid);
    if (!this.contactForm.invalid) {
      console.log('dataToSave > ', dataToSave);
      this.contactsService.saveContact(dataToSave).subscribe({
        next: (res) => {
          console.log('res > ', res);
        },
        error: (err) => {
          this.serverErrorMessage = err;
          console.log('err > ', err);
        },
        complete: () => {
          this.submitting = false;
        },
      });
      this.contactsService.getContactsObservable();
    }
  }

  hearTypeSelected(option: Type) {
    console.log('option > ', option);
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

  markAllControlsAsTouched(group: FormGroup) {
    Object.keys(group.controls).forEach((controlName) => {
      const control = group.get(controlName);
      if (control instanceof FormGroup) {
        this.markAllControlsAsTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }
}
