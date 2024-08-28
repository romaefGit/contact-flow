import {
  Component,
  inject,
  ViewChild,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { ContactsService } from '../../../core/services/contacts/contacts.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SearchInputComponent } from '../../../components/form/search-input/search-input.component';
import { ButtonComponent } from '../../../components/user-interface/button/button.component';
import { ContactFormModalComponent } from '../../../components/user-interface/base-modal/contact-form-modal/contact-form-modal.component';
import { Contact, Contacts } from '../../../core/models/contacts.model';
import { EditContactFormComponent } from '../../../components/user-interface/base-modal/edit-contact-form/edit-contact-form.component';

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
  ],
  templateUrl: './contacts-list.component.html',
  styleUrl: './contacts-list.component.scss',
})
export class ContactsListComponent {
  @ViewChild('createContactModal')
  createContactModal!: ContactFormModalComponent;

  @ViewChild('editContactModal')
  editContactModal!: ContactFormModalComponent;

  private readonly contactsService = inject(ContactsService);
  $contacts: Observable<Contacts> =
    this.contactsService.getContactsObservable();

  $filteredContacts: Observable<Contacts> = of([]); // Observable for the filtered contacts
  searchTerm: string = '';

  contactToEdit!: any;

  constructor() {}

  ngOnInit(): void {
    this.contactsService.getContacts().subscribe();
    this.contactsService.getContacts().subscribe(() => {
      this.updateFilteredContacts();
    });
  }

  private updateFilteredContacts() {
    console.log('this.searchTerm > ');

    this.$filteredContacts = this.contactsService
      .getContactsObservable()
      .pipe(map((contacts) => this.filterContacts(contacts)));
  }

  private filterContacts(contacts: Contacts): Contacts {
    if (!this.searchTerm) {
      return contacts;
    }

    const query = this.searchTerm.toLowerCase();
    console.log('query > ', query);

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
    this.contactToEdit = contact;
    setTimeout(() => {
      this.editContactModal.openDialog();
    }, 0);
  }

  hearClose(e: any) {
    console.log('closi');

    this.contactToEdit = null;
  }
}
