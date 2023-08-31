import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

import { TokenStorage } from '../storage/TokenStorage';

type ApiClientResponse<T extends {} = {}> = {
  statusCode: number;
  body: T;
};

type Response<T> = {
  status: number;
  data: T;
};

enum Method {
  get = 'GET',
  post = 'POST',
  patch = 'PATCH'
}

export class ApiClientError extends Error {
  constructor(readonly statusCode: number, message: string) {
    super(message);
  }
}

export class ApiClient {
  private readonly http: AxiosInstance;
  private readonly tokenStorage: TokenStorage;

  constructor() {
    this.http = axios.create({ baseURL: process.env.VUE_APP_BACKEND_URL });
    this.http.interceptors.response.use(
      (response: AxiosResponse): AxiosResponse => {
        return response;
      },
      (error: AxiosError) => {
        const statusCode = error.response?.status ?? 500;
        const errorMessage = error.message;

        throw new ApiClientError(statusCode, errorMessage);
      }
    );

    this.tokenStorage = new TokenStorage();
  }

  async get<T extends {}>(url: string): Promise<ApiClientResponse<T>> {
    const response = await this.doRequest<T>({
      method: Method.get,
      url,
    });

    return {
      statusCode: response.status,
      body: response.data,
    };
  }

  async post<T extends {}>(
    url: string,
    data: {} = {}
  ): Promise<ApiClientResponse<T>> {
    const response = await this.doRequest<T>({
      method: Method.post,
      url,
      data,
    });

    return {
      statusCode: response.status,
      body: response.data,
    };
  }

  async patch<T extends {}>(
    url: string,
    data: {} = {}
  ): Promise<ApiClientResponse<T>> {
    const response = await this.doRequest<T>({
      method: Method.patch,
      url,
      data,
    });

    return {
      statusCode: response.status,
      body: response.data,
    };
  }

  private async doRequest<T>({
    method,
    url,
    data = {},
  }: {
    method: Method;
    url: string;
    data?: {};
  }): Promise<Response<T>> {
    const authorizationHeader = this.authorizationHeader();

    const response = await this.http({
      method: method.toString(),
      url,
      data,
      headers: {
        Authorization: authorizationHeader,
      },
    });

    return response;
  }

  private authorizationHeader(): string | undefined {
    const token = this.tokenStorage.get();

    if (token === null) {
      return undefined;
    }

    return `Bearer ${token.token}`;
  }
}
