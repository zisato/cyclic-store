export class CreateProductCommand {
    constructor(public readonly id: string, public readonly name: string, public readonly storeId: string) {}
  }
  