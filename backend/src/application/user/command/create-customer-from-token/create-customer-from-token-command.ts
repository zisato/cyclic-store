export class CreateCustomerFromTokenCommand {
    constructor(readonly id: string, readonly token: string) {}
}
