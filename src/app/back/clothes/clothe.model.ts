export class ClotheCollection {
    total: number;
}

export class Clothe {
    // Faltan campos
    title: string
    description: string
    price: string
    popularity: string
    impacts: number
    is_recommended: number
    constructor(values: any = {}) {
        Object.assign(this, values);
    }
}