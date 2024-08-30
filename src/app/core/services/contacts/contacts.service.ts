import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  Observable,
  of,
  throwError,
  catchError,
  merge,
  Subject,
} from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Contact, Contacts } from '../../models/contacts.model';
import { environment } from '../../../../environments/environment';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private users: User[] = [];
  private contacts: Contacts = [];

  private usersSubject = new BehaviorSubject<User[]>(this.users);
  private contactsSubject = new BehaviorSubject<Contacts>(this.contacts);

  private _http = inject(HttpClient);
  private destroy$ = new Subject<void>();

  // Fetch contacts from the server and filter out duplicates
  getContacts(): Observable<Contact[]> {
    return this._http
      .get(`${environment.api}/users/${this.getSession().user.id}`)
      .pipe(
        map((user: any) => user.contacts),
        map((contacts: Contact[]) =>
          contacts.filter(
            (newContact: Contact) =>
              !this.contacts.some(
                (existingContact: Contact) =>
                  existingContact.id === newContact.id,
              ),
          ),
        ),
        tap((contacts: Contact[]) => {
          this.contactsSubject.next(contacts);
        }),
      );
  }

  getContactsObservable() {
    return this.contactsSubject.asObservable();
  }

  // Save a contact to a user
  saveContact(contact: Contact): Observable<any> {
    return this._http
      .get(`${environment.api}/users/${this.getSession().user.id}`)
      .pipe(
        switchMap((user: any) => {
          if (!user) {
            return throwError(() => new Error('User not found'));
          }

          // Generate a unique ID and clone the contact object
          contact.id = this.generateUniqueCode(32);
          let contactData = { ...contact };

          // Ensure that the user's contacts array is initialized
          if (user.contacts) {
            user.contacts.push(contactData);
          } else {
            user.contacts = [contactData];
          }

          console.log('user > ', user);

          // Execute the PUT request to update the user
          return this._http
            .put(`${environment.api}/users/${user.id}`, user)
            .pipe(
              tap((updatedUser: any) => {
                // Update local state
                this.contactsSubject.next(updatedUser.contacts);
              }),
            );
        }),
      );
  }

  // Update a contact in a user
  updateContact(contact: Contact): Observable<any> {
    return this._http
      .get(`${environment.api}/users/${this.getSession().user.id}`)
      .pipe(
        switchMap((user: any) => {
          const contactToUpdate = user.contacts?.find(
            (existing: any) => existing.id === contact.id,
          );

          if (!contactToUpdate) {
            return throwError(() => new Error('Contact not found'));
          }

          // Update the user object with the new contact details
          let newUser = this.updateContactObject(user, contact);

          console.log('user > update > ', user);
          console.log('newUser >', newUser);

          // Execute the PUT request to update the user
          return this._http
            .put(`${environment.api}/users/${newUser.id}`, newUser)
            .pipe(
              tap(() => {
                // Update local state
                this.usersSubject.next(this.users);
                this.contactsSubject.next(
                  newUser.contacts ? newUser.contacts : [],
                );
              }),
              catchError((error) => {
                // Handle errors from the HTTP request
                console.error('Error updating user:', error);
                return throwError(() => new Error('Failed to update contact'));
              }),
            );
        }),
      );
  }

  updateContactObject(user: User, updatedContact: Contact): User {
    const contactIndex: any = user.contacts?.findIndex(
      (contact) => contact.id === updatedContact.id,
    );

    if (contactIndex === -1) {
      throw new Error('Contact not found');
    }

    // Merge existing contact with updated contact information
    var newUser: any = JSON.parse(JSON.stringify(user));

    if (newUser?.contacts && contactIndex >= 0) {
      let contacts: Contacts = newUser.contacts;

      contacts[contactIndex] = updatedContact;
      newUser.contacts = contacts;
    }

    return newUser;
  }

  // Delete a contact from a user
  deleteContact(contactId: string): Observable<any> {
    return this._http
      .get(`${environment.api}/users/${this.getSession().user.id}`)
      .pipe(
        switchMap((user: any) => {
          if (user?.contacts) {
            const contactIndex = user.contacts.findIndex(
              (contact: any) => contact.id === contactId,
            );

            if (contactIndex === -1) {
              return throwError(() => new Error('Contact not found'));
            }

            user.contacts.splice(contactIndex, 1);
          }
          return this._http
            .put(`${environment.api}/users/${this.getSession().user.id}`, user)
            .pipe(
              tap(() => {
                // Update local state
                this.usersSubject.next(this.users);
                this.contactsSubject.next(user.contacts ? user.contacts : []);
              }),
            );
        }),
      );
  }

  // Method to reset contacts on login or session start
  resetContacts(): void {
    this.contacts = [];
    this.contactsSubject.next(this.contacts); // Clear the BehaviorSubject
  }

  // Method to handle unsubscription and clean up
  stopSubscriptions(): void {
    this.destroy$.next(); // Emit value to complete subscriptions
    this.destroy$.complete(); // Complete the Subject

    // Optionally reset BehaviorSubject
    this.resetContacts(); // Ensure contacts are cleared
  }

  private getSession() {
    try {
      const session = sessionStorage.getItem('session');
      return session ? JSON.parse(session) : {};
    } catch (error) {
      console.error('Error parsing session data:', error);
      return null;
    }
  }

  private generateUniqueCode(length: number) {
    var characters = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789'";
    var code = '';
    for (let i = 0; i < length; i++)
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    return code;
  }
}
