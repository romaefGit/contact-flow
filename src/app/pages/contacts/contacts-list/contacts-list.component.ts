import { Component, inject, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactsService } from '../../../core/services/contacts/contacts.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SearchInputComponent } from '../../../components/form/search-input/search-input.component';
import { ButtonComponent } from '../../../components/user-interface/button/button.component';
import { ContactFormModalComponent } from '../../../components/user-interface/base-modal/contact-form-modal/contact-form-modal.component';

@Component({
  selector: 'app-contacts-list',
  standalone: true,
  imports: [
    AsyncPipe,
    RouterLink,
    SearchInputComponent,
    ButtonComponent,
    ContactFormModalComponent,
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
  $contacts: Observable<any> = this.contactsService.getContacts();

  constructor() {}

  ngOnInit(): void {
    console.log('$contacts > ', this.$contacts);
  }

  openCreateModal() {
    this.createContactModal.openDialog();
  }
}
