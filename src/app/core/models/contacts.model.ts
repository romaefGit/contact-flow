export interface Contact {
  id?: string;
  first_name: string;
  last_name?: string;
  phone: number;
  phone_type?: string;
  company?: string;
  email?: string;
  email_type?: string;
  significant_date?: string;
  notes?: string;
}

export type Contacts = Contact[];
