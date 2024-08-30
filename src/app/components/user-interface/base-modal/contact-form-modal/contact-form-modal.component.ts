import {
  Component,
  OnInit,
  ViewChild,
  Input,
  inject,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { BaseModalComponent } from '../base-modal.component';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { InputTextComponent } from '../../../form/input-text/input-text.component';
import { ButtonComponent } from '../../button/button.component';
import { ContactsService } from '../../../../core/services/contacts/contacts.service';
import { DropdownComponent } from '../../../form/dropdown/dropdown.component';
import { TypesService } from '../../../../core/services/types/types.service';
import { Type, Types } from '../../../../core/models/types.model';
import { AsyncPipe, JsonPipe, KeyValuePipe, NgFor } from '@angular/common';
import { InfoMessageComponent } from '../../info-message/info-message.component';
import { MessageModalComponent } from '../message-modal/message-modal.component';

@Component({
  selector: 'app-contact-form-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BaseModalComponent,
    InputTextComponent,
    ReactiveFormsModule,
    ButtonComponent,
    DropdownComponent,
    AsyncPipe,
    JsonPipe,
    KeyValuePipe,
    NgFor,
    InfoMessageComponent,
    MessageModalComponent,
  ],
  templateUrl: './contact-form-modal.component.html',
  styleUrl: './contact-form-modal.component.scss',
})
export class ContactFormModalComponent implements OnInit {
  @ViewChild('dialog') dialog!: BaseModalComponent;
  @ViewChild('messageModal') messageModal!: MessageModalComponent;

  @Output() action = new EventEmitter<any>();

  private readonly contactsService = inject(ContactsService);
  private readonly typesService = inject(TypesService);
  typesList: Types = [];

  dialogOpened: boolean = false;

  contactForm!: FormGroup;
  private fb: FormBuilder = inject(FormBuilder);
  submitting: boolean = false;
  initForm: boolean = false;
  serverErrorMessage: string = '';
  phoneErrors: any[] = []; // Array to hold error messages for each phone group

  serverMessage: any = {
    type: 'success',
    message: 'Success operation',
  };

  phonePattern = /^\+?\d{10,15}$/; // Accepts '+573214567896' or '3214567896'
  wordPattern = /^[A-Za-z]+(?: [A-Za-z]+)*$/; // words only

  ngOnInit(): void {
    this.typesService.getTypes().subscribe({
      next: (types) => {
        this.typesList = types;
      },
      error: (err) => {
        console.error(err);
      },
    });
    // Init form
    this.contactForm = this.fb.group({
      first_name: [
        '',
        [Validators.required, Validators.pattern(this.wordPattern)],
      ],
      last_name: ['', Validators.pattern(this.wordPattern)],
      phones: this.fb.array(
        [this.createPhoneGroup()],
        this.atLeastOnePhoneValidator(),
      ),
      company: ['', Validators.pattern(this.wordPattern)],
      email: ['', [Validators.email]],
      notes: [''],
    });

    this.initForm = true;
  }

  /**
   * Opens the modal dialog and resets the form.
   * clears the form fields.
   * This method is typically called when the user initiates a create or update action.
   */
  openDialog() {
    this.contactForm.reset();
    this.dialog.openDialog();
  }

  /**
   * Closes the modal dialog and resets the form.
   * clears the form fields.
   * This method is typically called when the user cancels an action.
   */
  closeDialog() {
    this.contactForm.reset();
    this.dialog.closeDialog();
  }

  /**
   * Creates a new FormGroup for phone entry with validation.
   * The group contains fields for `phone` and `phone_type`.
   * The `phone` field is required and must match the specified phone pattern.
   * @returns A FormGroup for phone entry.
   */
  createPhoneGroup(): FormGroup {
    return this.fb.group({
      phone: ['', [Validators.required, Validators.pattern(this.phonePattern)]],
      phone_type: [''],
    });
  }

  /**
   * Retrieves the `phones` FormArray from the contact form.
   * This array contains all the phone groups added by the user.
   * @returns The `phones` FormArray.
   */
  get phones(): FormArray {
    return this.contactForm.get('phones') as FormArray;
  }

  /**
   * Retrieves a specific phone group as a FormGroup from the FormArray at the given index.
   * This is useful for accessing the controls within a specific phone group.
   * @param index The index of the phone group in the `phones` FormArray.
   * @returns The FormGroup at the specified index.
   */
  getPhonesAsFormGroup(index: number): FormGroup {
    return this.phones.at(index) as FormGroup;
  }

  /**
   * Retrieves a specific FormControl from a phone group at a given index.
   * This is used to access individual controls within a specific phone group, such as `phone` or `phone_type`.
   * @param index The index of the phone group in the `phones` FormArray.
   * @param controlName The name of the control within the phone group to retrieve.
   * @returns The FormControl corresponding to the given `controlName`.
   */
  getPhoneControl(index: number, controlName: string): FormControl {
    const phoneGroup = this.getPhonesAsFormGroup(index);
    return phoneGroup.get(controlName) as FormControl;
  }

  /**
   * Custom validator to ensure at least one phone number is added to the contact form.
   * This validator checks the length of the `phones` FormArray and returns an error if no phones are present.
   * @returns A ValidatorFn that returns a validation error if no phones are present, otherwise null.
   */
  atLeastOnePhoneValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formArray = control as any as FormArray;
      return formArray.length > 0 ? null : { noPhone: true };
    };
  }

  /**
   * Receives an error message for a specific phone group and updates the `phoneErrors` array.
   * If the error message is non-null, it marks the phone group as having an error.
   * If the error message is null, it marks the phone group as resolved.
   * @param index The index of the phone group in the `phones` FormArray.
   * @param message The error message for the phone group.
   */
  receiveErrorMessage({ index, message }: { index: number; message: string }) {
    if (message !== null) {
      this.phoneErrors[index] = { solved: false };
      this.phoneErrors[index] = message;
    } else {
      this.phoneErrors[index] = { solved: true };
    }
  }

  /**
   * Adds a new phone group to the `phones` FormArray in the contact form.
   * This method is typically called when the user wants to add another phone number.
   */
  addPhone(): void {
    this.phones.push(this.createPhoneGroup());
  }

  /**
   * Removes a phone group at a specific index from the `phones` FormArray.
   * This method is typically called when the user wants to delete a phone number.
   * @param index The index of the phone group to be removed.
   */
  removePhone(index: number): void {
    this.phones.removeAt(index);
  }

  /**
   * Sets the selected phone type in the corresponding FormGroup based on the index.
   *
   * @param selectedValue - The value selected from the dropdown.
   * @param index - The index of the FormGroup within the FormArray.
   */
  setSelectedTypePhone(option: any, index: number): void {
    // Get the specific FormGroup at the provided index
    const phoneGroup = this.getPhonesAsFormGroup(index);
    // console.log('option to save > ', option);

    phoneGroup.get('phone_type')?.setValue(option);
  }

  /**
   * Submits the contact form after marking all controls as touched.
   * If the form is valid, it sends the form data to the `contactsService` for saving.
   * Handles the response from the server and updates the UI accordingly.
   */
  submitForm() {
    this.markAllControlsAsTouched(this.contactForm);
    const dataToSave = this.contactForm.value;
    // console.log('dataToSave > ', dataToSave);

    // console.log('this.contactForm.invalid > ', this.contactForm.invalid);

    if (!this.contactForm.invalid) {
      this.contactsService.saveContact(dataToSave).subscribe({
        next: (res) => {
          this.serverMessage.type = 'success';
          this.serverMessage.message = 'The contact was saved successfully';
          this.messageModal.openDialog();
          this.action.emit();
          // console.log('res > ', res);
        },
        error: (err) => {
          this.serverMessage.type = 'error';
          this.serverMessage.message = err?.message;
          this.messageModal.openDialog();
        },
        complete: () => {
          this.submitting = false;
          this.closeDialog();
        },
      });
    }
  }

  /**
   * Retrieves a specific form control from the contact form based on the column name.
   * This method is useful for binding the form control to custom input or textarea components.
   * @param columnName The name of the form control to retrieve.
   * @returns The FormControl corresponding to the given `columnName`.
   */
  getAsFormControl(columnName: string) {
    return this.contactForm.get(columnName) as FormControl;
  }

  /**
   * Marks all controls within a FormGroup as touched.
   * This method is used to trigger validation for all fields in the form.
   * If the control is a nested FormGroup, it recursively marks all child controls as touched.
   * @param group The FormGroup to mark as touched.
   */
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
