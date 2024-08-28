import {
  Component,
  OnInit,
  ViewChild,
  Input,
  inject,
  ChangeDetectionStrategy,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
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
import { ContactsService } from '../../../../core/services/contacts/contacts.service';
import { DropdownComponent } from '../../../form/dropdown/dropdown.component';
import { TypesService } from '../../../../core/services/types/types.service';
import { Types } from '../../../../core/models/types.model';
import { AsyncPipe, JsonPipe, KeyValuePipe, NgFor } from '@angular/common';
import { InfoMessageComponent } from '../../info-message/info-message.component';
import { Observable, Subscription, take, tap } from 'rxjs';
import { ContactActiveService } from '../../../../core/services/contact-active/contact-active.service';
import { Contact } from '../../../../core/models/contacts.model';

@Component({
  selector: 'app-edit-contact-form',
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
  ],
  standalone: true,
  templateUrl: './edit-contact-form.component.html',
  styleUrl: './edit-contact-form.component.scss',
})
export class EditContactFormComponent implements OnInit, OnDestroy {
  @ViewChild('dialog') dialog!: BaseModalComponent;
  @Input() action = new EventEmitter<any>();

  contactToEdit: Contact | null = null;
  private subscription!: Subscription;

  private readonly contactsService = inject(ContactsService);
  private readonly typesService = inject(TypesService);
  private readonly contactActiveService = inject(ContactActiveService);
  typesList: Types = [];

  contactForm!: FormGroup;
  private fb: FormBuilder = inject(FormBuilder);
  submitting: boolean = false;
  initForm: boolean = false;
  serverErrorMessage: string = '';
  phoneErrors: any[] = []; // Array to hold error messages for each phone group

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
    this.contactForm = this.fb.group({
      first_name: new FormControl('', [
        Validators.required,
        Validators.pattern(this.wordPattern),
      ]),
      last_name: new FormControl('', Validators.pattern(this.wordPattern)),
      // phones: this.fb.array(
      //   [this.createPhoneGroup()],
      //   this.atLeastOnePhoneValidator(),
      // ),
      company: new FormControl('', Validators.pattern(this.wordPattern)),
      email: new FormControl('', [Validators.email]),
      notes: new FormControl(''),
    });

    this.initForm = true;
  }

  dialogOpened(e: any) {
    this.initForm = true;
    this.subscription = this.contactActiveService.contactToEdit$.subscribe(
      (contact) => {
        this.contactToEdit = contact;
        this.patchForm();
      },
    );
  }

  patchForm() {
    this.contactForm.patchValue({
      first_name: this.contactToEdit?.first_name,
      last_name: this.contactToEdit?.last_name,
      company: this.contactToEdit?.company,
      email: this.contactToEdit?.email,
      notes: this.contactToEdit?.notes,
    });
  }

  /**
   * Opens the modal dialog and resets the form.
   * This method is typically called when the user initiates a create or update action.
   */
  openDialog() {
    this.subscription = this.contactActiveService.contactToEdit$.subscribe(
      (contact) => {
        this.contactToEdit = contact;
      },
    );
    this.patchForm();
    this.dialog.openDialog();
  }

  /**
   * Closes the modal dialog and resets the form.
   * This method is typically called when the user cancels an action.
   */
  closeDialog() {
    this.initForm = false;
    this.dialog.closeDialog();
    this.subscription.unsubscribe();
  }

  /**
   * Submits the contact form after marking all controls as touched.
   * If the form is valid, it sends the form data to the `contactsService` for saving.
   * Handles the response from the server and updates the UI accordingly.
   */
  submitForm() {
    this.markAllControlsAsTouched(this.contactForm);
    const dataToSave = this.contactForm.value;
    dataToSave.id = this.contactToEdit?.id;
    dataToSave.phones = this.contactToEdit?.phones;

    console.log('dataToSave > ', dataToSave);

    console.log('this.contactFormEdit.invalid > ', this.contactForm.invalid);

    if (!this.contactForm.invalid) {
      this.contactsService.updateContact(dataToSave).subscribe({
        next: (res) => {
          console.log('res > ', res);
        },
        error: (err) => {
          this.serverErrorMessage = err;
          console.log('err > ', err);
        },
        complete: () => {
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
