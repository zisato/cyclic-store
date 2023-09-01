import { ApiClient } from '../clients/api-client'
import { Store } from '../models/Store'

type JsonApiResponse<T> = {
  data: T
}

type JsonApiStoreDto = {
  id: string
  attributes: {
      name: string
  }
}

export class ApiClientStoreRepository {
  private readonly apiClient: ApiClient

  constructor() {
    this.apiClient = new ApiClient()
  }

  async getById(id: string): Promise<Store> {
    const response = await this.apiClient.get<JsonApiResponse<JsonApiStoreDto>>(`/stores/${id}`)
   
    return {
      id: response.body.data.id,
      name: response.body.data.attributes.name
    }
  }

  async findAll(): Promise<Store[]> {
    const response = await this.apiClient.get<JsonApiResponse<JsonApiStoreDto[]>>('/stores')

    return response.body.data.map((storeDto) => {
      return {
        id: storeDto.id,
        name: storeDto.attributes.name
      }
    })
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
