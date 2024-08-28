import { Injectable, inject } from '@angular/core';
import { Types } from '../../models/types.model';
import { Observable, BehaviorSubject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TypesService {
  private _http = inject(HttpClient);

  constructor() {}

  getTypes(): Observable<any> {
    return this._http.get(`${environment.api}/types`);
  }
}
