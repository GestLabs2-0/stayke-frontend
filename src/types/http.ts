import type { AxiosRequestConfig, AxiosResponse } from "axios";

export interface HttpClientInterface {
  get(options: GetParams): Promise<AxiosResponse<unknown, unknown, object>>;
  post(options: PostParams): Promise<AxiosResponse<unknown, unknown, object>>;
  delete(
    options: DeleteParams,
  ): Promise<AxiosResponse<unknown, unknown, object>>;
  put(options: PutParams): Promise<AxiosResponse<unknown, unknown, object>>;
  patch(options: PutParams): Promise<AxiosResponse<unknown, unknown, object>>;
}

export interface GetParams {
  url: string;
  headers?: object;
  options?: AxiosRequestConfig;
}

export interface PostParams {
  url: string;
  body?: object;
  headers?: object;
  options?: AxiosRequestConfig;
}

export interface PutParams {
  url: string;
  body?: object;
  headers?: object;
  options?: AxiosRequestConfig;
}
export interface DeleteParams {
  url: string;
  headers?: object;
  options?: AxiosRequestConfig;
}

export interface LocalStorageKeys {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  status: boolean;
  data: T | null;
  message: string | string[];
  errors?: string[];
}

export interface LoginResponse {
  accessToken: string;
}
