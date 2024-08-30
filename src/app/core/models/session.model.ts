import { UserImpl } from './user.model';

export class Session {
  user: UserImpl;
  token: string;

  constructor() {
    this.user = new UserImpl();
    this.token = '';
  }
}
