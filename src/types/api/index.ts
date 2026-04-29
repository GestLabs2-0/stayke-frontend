import { AxiosRequestConfig } from "axios";

export interface ApiResponse<T> {
  status: boolean;
  data: T;
  message: string;
  errors?: Record<string, string>;
}

export interface GetParams {
  url: string;
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

export interface HttpClientI {
  get<T>(params: GetParams): Promise<T>;
  post<T>(params: PostParams): Promise<T>;
  put<T>(params: PutParams): Promise<T>;
  delete<T>(params: DeleteParams): Promise<T>;
}

export interface ResponseI<T = unknown> {
  data: T | null;
  message: string | string[];
  status: boolean;
}
