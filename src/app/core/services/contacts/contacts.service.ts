import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap, throwError } from 'rxjs';
import { Contact, Contacts, Phone } from '../../models/contacts.model';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private contacts: Contacts = [];
  // private contactsSubject = new BehaviorSubject<Contacts>([]);
  private contactsSubject = new BehaviorSubject<Contacts>(this.contacts);

  private _http = inject(HttpClient);

  constructor() {}

  // Fetch contacts from the server and filter out duplicates
  getContacts(): Observable<void> {
    return this._http.get<Contact[]>(`${environment.api}/contacts`).pipe(
      map((res: Contact[]) => {
        // Filter out duplicates
        const newContacts = res.filter(
          (newContact: Contact) =>
            !this.contacts.some(
              (existingContact: Contact) =>
                existingContact.id === newContact.id,
            ),
        );

        // Concatenate new contacts
        this.contacts = this.contacts.concat(newContacts);

        // Emit the updated contacts array
        this.contactsSubject.next(this.contacts);
      }),
    );
  }

  // Get an observable of the contacts
  getContactsObservable(): Observable<Contact[]> {
    return this.contactsSubject.asObservable();
  }

  getContactById(id: string): Observable<any> {
    return this._http.get(`${environment.api}/contacts/${id}`);
  }

  saveContact(contact: Contact): Observable<any> {
    // Check if any of the contact's phone numbers already exist in the contacts array
    const existingContactPhone = this.contacts.find((existing: Contact) => {
      return existing.phones.some((existingPhone: Phone) =>
        contact.phones.some(
          (newPhone: Phone) => newPhone.phone === existingPhone.phone,
        ),
      );
    });

    // Check if the contact's email already exists in the contacts array
    const existingContactEmail = this.contacts.find(
      (existing: Contact) => existing.email === contact.email,
    );

    if (existingContactPhone) {
      return throwError(
        () => new Error('Contact with the same phone number already exists'),
      );
    }

    if (existingContactEmail) {
      return throwError(
        () => new Error('Contact with the same email already exists'),
      );
    }

    // If no duplicate is found, proceed to save the contact
    let contactData = {
      id: this.generateUniqueCode(16),
      ...contact,
    };
    this.contacts.push(contactData);
    this.contactsSubject.next(this.contacts);

    return this._http.post(`${environment.api}/contacts`, contactData);
  }

  // Methods
  private generateUniqueCode(length: number) {
    var characters = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789'";
    var code = '';
    for (let i = 0; i < length; i++)
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    return code;
  }
}
