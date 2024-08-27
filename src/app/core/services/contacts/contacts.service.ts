import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContactsService {
  private _http = inject(HttpClient);

  constructor() {}

  getContacts(): Observable<any> {
    return this._http.get('http://localhost:3000/contacts');
    // .subscribe({
    //   next: (res) => {
    //     console.log('res > ', res);
    //   },
    //   error: (err) => {
    //     console.error('Error calling contacts > ', err);
    //   },
    //   complete: () => {
    //     console.log('completed');
    //   },
    // });
  }

  getContactById(id: string): Observable<any> {
    return this._http.get(`http://localhost:3000/contacts/${id}`);
  }

  getPosts(): Observable<any> {
    return this._http.get('http://localhost:3000/posts');
  }
}
