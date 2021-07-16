export class ClotheCollection {
    total: number;
}

export class Clothe {
    // Faltan campos
    title: string
    description: string
    price: string
    popularity?;
    impacts?;
    isRecommended: number
    categories;
    image;
    constructor(values: any = {}) {
        Object.assign(this, values);
    }
}