import { Contacts } from './contacts.model';
export interface User {
  id: string;
  _id: string;
  name?: string;
  email: string;
  password?: string;
  active?: string;
  creationDate?: string;
  contacts?: Contacts;
}

export class UserImpl implements User {
  id!: string;
  _id!: string;
  email!: string;
  name?: string;
  active?: string;
  creationDate?: string;
  password?: string;
  contacts?: Contacts;

  constructor() {
    this.contacts = [];
  }
}
