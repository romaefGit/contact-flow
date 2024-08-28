import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contact } from '../../models/contacts.model';

@Injectable({
  providedIn: 'root',
})
export class ContactActiveService {
  // Initialize a BehaviorSubject to store the current contact
  private contactToEditSubject = new BehaviorSubject<Contact | null>(null);

  // Observable for components to subscribe to
  contactToEdit$: Observable<Contact | null> =
    this.contactToEditSubject.asObservable();

  // Method to update the contact data
  updateContact(contact: Contact): void {
    this.contactToEditSubject.next(contact);
  }

  // Method to clear the contact data
  clearContact(): void {
    this.contactToEditSubject.next(null);
  }
}
