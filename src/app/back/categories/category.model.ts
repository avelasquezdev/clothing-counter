export class CategoryCollection {
    total: number;
}

export class Category {
    name: string
    constructor(values: any = {}) {
        Object.assign(this, values);
    }
}
