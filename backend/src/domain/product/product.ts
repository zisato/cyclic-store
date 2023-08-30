export class Product {
    readonly id: string;
    readonly name: string;
    readonly storeId: string;

    constructor({ id, name, storeId }: { id: string; name: string; storeId: string }) {
        this.id = id;
        this.name = name;
        this.storeId = storeId;
    }

    changeName(newName: string): Product {
        return new Product({ ...this, name: newName });
    }
}
