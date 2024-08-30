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
import { map, tap } from 'rxjs/operators';
import { Contact, Contacts, Phone } from '../../models/contacts.model';
import { environment } from '../../../../environments/environment';
import { User, UserImpl } from '../../models/user.model';

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
      );
  }

  // Save a contact to a user
  saveContact(contact: Contact): Observable<any> {
    const user = this.getSession().user;

    if (!user) {
      return throwError(() => new Error('User not found'));
    }
    // If no duplicate is found, proceed to save the contact
    let contactData = { ...contact };

    if (user?.contacts) {
      user?.contacts.push(contactData);
    } else {
      user.contacts?.push(contactData);
    }
    console.log('user > ', user);

    return this._http
      .put(`${environment.api}/users/${this.getSession().user.id}`, user)
      .pipe(
        tap(() => {
          // Update local state
          this.usersSubject.next(this.users);
        }),
      );
  }
  // Update a contact in a user
  updateContact(contact: Contact): Observable<any> {
    return this._http
      .get(`${environment.api}/users/${this.getSession().user.id}`)
      .pipe(
        map((user: any) => ({
          user,
          contacts: user.contacts,
        })),
        tap(({ user, contacts }) => {
          const contactToUpdate = contacts?.find(
            (existing: any) => existing.id === contact.id,
          );

          if (!contactToUpdate) {
            return throwError(() => new Error('Contact not found'));
          }

          let newUser = this.updateContactObject(user, contact);

          console.log('user > update > ', user);
          console.log('newUser >', newUser);

          return this._http
            .put(
              `${environment.api}/users/${this.getSession().user.id}`,
              newUser,
            )
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
    const user = this.users.find(
      (user) => user.id === this.getSession().user.id,
    );

    if (!user) {
      return throwError(() => new Error('User not found'));
    }
    if (user?.contacts) {
      const contactIndex = user.contacts.findIndex(
        (contact) => contact.id === contactId,
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
  }

  // stopSubscriptions() {
  //   // Reset the BehaviorSubject
  //   this.contacts = [];
  //   this.contactsSubject.next(this.contacts);

  //   console.log('Unsubscribing and resetting contacts...');
  //   this.destroy$.next(); // Emit value to complete subscriptions
  //   this.destroy$.complete(); // Complete the Subject
  //   // Optional: Log to verify reset
  //   console.log('Contacts reset:', this.contacts);
  //   this.contactsSubject.subscribe((res) => console.log('jueputa 3 > ', res));
  // }

  // Method to reset contacts on login or session start
  resetContacts(): void {
    console.log('Resetting contacts...');
    this.contacts = [];
    this.contactsSubject.next(this.contacts); // Clear the BehaviorSubject
    console.log('Contacts cleared:', this.contacts);
  }

  // Method to handle unsubscription and clean up
  stopSubscriptions(): void {
    console.log('Unsubscribing and resetting contacts...');
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
}
