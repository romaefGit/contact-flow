import { Component, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ContactsService } from '../../../core/services/contacts/contacts.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SearchInputComponent } from '../../../components/form/search-input/search-input.component';

@Component({
  selector: 'app-contacts-list',
  standalone: true,
  imports: [AsyncPipe, RouterLink, SearchInputComponent],
  templateUrl: './contacts-list.component.html',
  styleUrl: './contacts-list.component.scss',
})
export class ContactsListComponent {
  private readonly contactsService = inject(ContactsService);
  $contacts: Observable<any> = this.contactsService.getContacts();

  constructor() {}

  ngOnInit(): void {
    console.log('$contacts > ', this.$contacts);
  }
}
