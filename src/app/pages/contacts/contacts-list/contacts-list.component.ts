import {
  Component,
  inject,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { ContactsService } from '../../../core/services/contacts/contacts.service';
import { AsyncPipe, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { SearchInputComponent } from '../../../components/form/search-input/search-input.component';
import { ButtonComponent } from '../../../components/user-interface/button/button.component';
import { ContactFormModalComponent } from '../../../components/user-interface/base-modal/contact-form-modal/contact-form-modal.component';
import { Contact, Contacts } from '../../../core/models/contacts.model';
import { EditContactFormComponent } from '../../../components/user-interface/base-modal/edit-contact-form/edit-contact-form.component';
import { ContactActiveService } from '../../../core/services/contact-active/contact-active.service';
import { MessageModalComponent } from '../../../components/user-interface/base-modal/message-modal/message-modal.component';
import { ConfirmModalComponent } from '../../../components/user-interface/base-modal/confirm-modal/confirm-modal.component';
import { SessionService } from '../../../core/services/user/session/session.service';

@Component({
  selector: 'app-contacts-list',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    SearchInputComponent,
    ButtonComponent,
    ContactFormModalComponent,
    EditContactFormComponent,
    NgClass,
    MessageModalComponent,
    ConfirmModalComponent,
  ],
  templateUrl: './contacts-list.component.html',
  styleUrl: './contacts-list.component.scss',
})
export class ContactsListComponent {
  @ViewChild('createContactModal')
  createContactModal!: ContactFormModalComponent;

  @ViewChild('editContactModal')
  editContactModal!: ContactFormModalComponent;

  @ViewChild('deleteModal')
  deleteModal!: ConfirmModalComponent;

  @ViewChild('messageModal') messageModal!: MessageModalComponent;

  private readonly contactsService = inject(ContactsService);
  private readonly sessionService = inject(SessionService);
  private readonly contactActiveService = inject(ContactActiveService);
  private router = inject(Router);

  $filteredContacts: Observable<Contacts> = of([]); // Observable for the filtered contacts
  searchTerm: string = '';

  contactToEdit!: any;
  openEdit: boolean = false;

  serverMessage: any = {
    type: 'success',
    message: '',
  };

  deleteContactId!: string;

  constructor() {}

  ngOnInit(): void {
    this.contactsService.getContacts().subscribe(() => {
      this.updateFilteredContacts();
    });
  }

  updateFilteredContacts() {
    // console.log('this.searchTerm > ');
    this.$filteredContacts = this.contactsService
      .getContacts()
      .pipe(map((contacts: any) => this.filterContacts(contacts)));
  }

  private filterContacts(contacts: Contacts): Contacts {
    if (!this.searchTerm) {
      return contacts;
    }

    const query = this.searchTerm.toLowerCase();
    // console.log('query > ', query);

    return contacts.filter((contact) => {
      return (
        contact.first_name.toLowerCase().includes(query) ||
        (contact.last_name &&
          contact.last_name.toLowerCase().includes(query)) ||
        (contact.email && contact.email.toLowerCase().includes(query)) ||
        contact.phones.some((phone) =>
          phone.phone.toLowerCase().includes(query),
        )
      );
    });
  }

  onSearchTermChange(term: string) {
    this.searchTerm = term;
    this.updateFilteredContacts();
  }

  openCreateModal() {
    this.createContactModal.openDialog();
  }

  openEditContact(contact: Contact) {
    this.openEdit = true;
    // console.log('contact > ', contact);

    this.contactActiveService.updateContact(contact);
    setTimeout(() => {
      this.editContactModal.openDialog();
    }, 0);
  }

  openConfirmationModal(contact: any) {
    this.deleteContactId = contact?.id;
    this.deleteModal.openDialog();
  }

  deleteContact() {
    this.contactsService.deleteContact(this.deleteContactId).subscribe({
      next: (res) => {
        this.serverMessage.message = 'The contact was removed successfully';
        this.messageModal.openDialog();
      },
      error: (err) => {
        this.serverMessage.type = 'error';
        this.serverMessage.message = err?.message
          ? err.message
          : 'Server error';
        this.messageModal.openDialog();
        console.error('err > ', err);
      },
    });
  }

  hearClose(e: any) {
    this.openEdit = false;
    this.contactToEdit = null;
  }

  logout() {
    this.sessionService.logout().subscribe({
      next: (value) => {
        this.router.navigate(['/auth/login']);
      },
    });
  }
}
