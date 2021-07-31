export class ClotheCollection {
    total: number;
}

export class Clothe {
    // Faltan campos
    title: string;
    link: string;
    description: string;
    price: string;
    popularity?;
    impacts?;
    isRecommended: number;
    categories;
    colors;
    sizes;
    brand: string;
    image;
    constructor(values: any = {}) {
        Object.assign(this, values);
    }
}