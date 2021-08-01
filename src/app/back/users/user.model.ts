export class UserCollection {
    total: number;
}

export class User {
    username: string;
    email: string;
    password: string;
    constructor(values: any = {}) {
        Object.assign(this, values);
    }
}
