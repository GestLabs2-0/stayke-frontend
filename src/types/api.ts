export interface ApiResponse<T> {
  status: boolean;
  data: T;
  message: string;
  errors?: Record<string, string>;
}

export interface HttpClientInterface {
  baseUrl: string;
  get<T>(uri: string, config?: object): Promise<T>;
  post<T>(uri: string, data?: object, config?: object): Promise<T>;
  put<T>(uri: string, data?: object, config?: object): Promise<T>;
  delete<T>(uri: string, config?: object): Promise<T>;
}
