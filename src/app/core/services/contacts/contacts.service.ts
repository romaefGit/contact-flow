import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, tap, throwError } from 'rxjs';
import { Contact, Contacts } from '../../models/contacts.model';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private contacts: Contacts = [];
  private contactsSubject = new BehaviorSubject<Contacts>([]);

  private _http = inject(HttpClient);

  constructor() {}

  getContacts(): Observable<any> {
    return this._http.get('http://localhost:3000/contacts').pipe(
      map((res: any) => {
        // Filter out duplicates
        const newContacts = res.filter(
          (newContact: any) =>
            !this.contacts.some(
              (existingContact: any) => existingContact.id === newContact.id,
            ),
        );

        // Concatenate new contacts
        this.contacts = this.contacts.concat(newContacts);

        // Emit the updated contacts array
        this.contactsSubject.next(this.contacts);
      }),
    );
  }

  getContactsObservable(): Observable<Contacts> {
    return this.contactsSubject.asObservable();
  }

  getContactById(id: string): Observable<any> {
    return this._http.get(`http://localhost:3000/contacts/${id}`);
  }

  // saveContact(contact: Contact): Observable<any> {
  //   let contactData = {
  //     id: this.generateUniqueCode(16),
  //     ...contact,
  //   };
  //   this.contacts.push(contactData);
  //   this.contactsSubject.next(this.contacts);

  //   return this._http.post(`http://localhost:3000/contacts/`, contactData);
  // }
  saveContact(contact: Contact): Observable<any> {
    // Check if contact with the same phone number or email already exists
    const existingContactPhone = this.contacts.find(
      (existing: Contact) =>
        existing.phone === contact.phone || existing.email === contact.email,
    );

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

    return this._http.post(`http://localhost:3000/contacts/`, contactData);
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
