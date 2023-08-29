export class Store {
    readonly id: string;
    readonly sellerId: string;
    readonly name: string;

    constructor({ id, sellerId, name }: { id: string; sellerId: string; name: string }) {
        this.id = id;
        this.sellerId = sellerId;
        this.name = name;
    }
}