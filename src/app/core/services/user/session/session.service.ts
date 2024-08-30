import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError, of, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { User, UserImpl } from '../../../models/user.model';
import { ContactsService } from '../../contacts/contacts.service';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private contactsService = inject(ContactsService);
  private http = inject(HttpClient);

  register(user: UserImpl): Observable<any> {
    user['contacts'] = [];
    return this.http.post(`${environment.api}/users`, user);
  }

  login(user: UserImpl): Observable<any> {
    return this.http.get<UserImpl[]>(`${environment.api}/users`).pipe(
      map((users: UserImpl[]) => {
        const foundUser = users.find((u) => u.email === user.email);

        if (!foundUser) {
          throw new Error('User not found');
        }

        if (foundUser.password != user.password) {
          throw new Error('Invalid credentials');
        }

        this.contactsService.resetContacts();

        const token = this.generateUniqueCode(32);
        const session = {
          user: foundUser,
          token: token,
        };

        // Save the session sessionStorage
        sessionStorage.setItem('session', JSON.stringify(session));
        return foundUser;
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError(() => new Error('Login failed'));
      }),
    );
  }

  getTokenSession() {
    var session = sessionStorage.getItem('session');
    let token = JSON.parse(session ? session : '{}')?.token;
    return token;
  }

  getSession() {
    try {
      const session = sessionStorage.getItem('session');
      return session ? JSON.parse(session) : {};
    } catch (error) {
      console.error('Error parsing session data:', error);
      return null;
    }
  }

  logout(): Observable<any> {
    return of(null).pipe(
      tap(() => {
        // Perform synchronous operations
        // Call method to unsubscribe and reset services
        this.contactsService.stopSubscriptions();

        sessionStorage.removeItem('session');
      }),
    );
  }

  private generateUniqueCode(length: number) {
    var characters = "abcdefghijkmnpqrtuvwxyzABCDEFGHIJKLMNPQRTUVWXYZ2346789'";
    var code = '';
    for (let i = 0; i < length; i++)
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    return code;
  }
}
