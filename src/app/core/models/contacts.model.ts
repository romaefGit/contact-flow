import { Type } from './types.model';

export interface Phone {
  phone: string;
  phone_type: Type;
}
export interface Contact {
  id?: string;
  first_name: string;
  last_name?: string;
  phones: Phone[];
  company?: string;
  email?: string;
  email_type?: string;
  notes?: string;
}

export type Contacts = Contact[];
