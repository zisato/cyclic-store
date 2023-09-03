import { ApiClient } from '../clients/api-client'
import { User } from '../models/User'
import { v1 } from 'uuid'

type JsonApiResponse<T> = {
  data: T
}

type JsonApiUserDto = {
  id: string
  attributes: {
    roles: string[]
  },
  relationships: {
    store: {
      id: string | null
    }
  }
}

export class ApiClientUserRepository {
  private readonly apiClient: ApiClient

  constructor() {
    this.apiClient = new ApiClient()
  }

  async getByToken(token: string): Promise<User> {
    const response = await this.apiClient.post<JsonApiResponse<JsonApiUserDto>>(
      '/login/callback',
      {
        data: {
          id: v1().toString(),
          attributes: {
            token,
          },
        },
      }
    );

    return {
      id: response.body.data.id,
      roles: response.body.data.attributes.roles,
      storeId: response.body.data.relationships.store.id
    };
  }

  async addSellerRole(id: string): Promise<void> {
    await this.apiClient.post(`/users/${id}/roles/seller`)
  }
}
