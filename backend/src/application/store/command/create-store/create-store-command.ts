export class CreateStoreCommand {
    constructor(readonly id: string, readonly sellerId: string, readonly name: string) {}
}