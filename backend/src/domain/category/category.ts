export class Category {
    readonly id: string;
    readonly name: string;

    constructor({ id, name }: { id: string; name: string }) {
        this.id = id;
        this.name = name;
    }

    changeName(newName: string): Category {
        return new Category({ ...this, name: newName });
    }
}
