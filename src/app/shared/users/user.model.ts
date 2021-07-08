export class UserCollection {
  total: number;
}

export class User {
  id: string;
  email: string;
  username: string;
  password: string;
  roles: any;
  constructor(values: any = {}) {
    Object.assign(this, values);
  }
}
