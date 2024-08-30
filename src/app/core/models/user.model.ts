import { Contacts } from './contacts.model';
export interface User {
  id: string;
  _id: string;
  name?: string;
  email: string;
  password?: string;
  creationDate?: string;
  contacts?: Contacts;
}
