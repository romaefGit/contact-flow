import { Injectable, inject } from '@angular/core';
import { Types } from '../../models/types.model';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TypesService {
  private _http = inject(HttpClient);

  constructor() {}

  getTypes(): Observable<any> {
    return this._http.get('http://localhost:3000/types');
  }

  getDateTypes(): Observable<any> {
    return this._http.get('http://localhost:3000/significantDates');
  }
}
