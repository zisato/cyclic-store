import { ApiClient } from '../clients/api-client'
import { Store } from '../models/Store'

export class ApiClientStoreRepository {
  private readonly apiClient: ApiClient

  constructor() {
    this.apiClient = new ApiClient()
  }


  async create(store: Store): Promise<void> {
    await this.apiClient.post('/admin/stores', {
      data: {
        id: store.id,
        attributes: {
          name: store.name
        }
      }
    })
  }
}
