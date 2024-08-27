interface Contact {
  id: string;
  name: string;
  last_name: string;
  phone_number: number;
  country_code?: string;
  house_number?: string;
}

export type Contacts = Contact[];
