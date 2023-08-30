export class User {
  readonly id: string;
  readonly providerId: string;
  readonly roles: string[];

  constructor({ id, providerId, roles }: { id: string; providerId: string, roles: string[] }) {
    this.id = id;
    this.providerId = providerId;
    this.roles = roles;
  }

  isSeller(): boolean {
    return this.roles.includes('seller');
  }

  isCustomer(): boolean {
    return this.roles.includes('customer');
  }

  addSellerRole(): User {
    if (this.isSeller()) {
      return this;
    }

    const newRoles = this.roles;
    newRoles.push('seller');

    return new User({ ...this, roles: newRoles });
  }
}