export interface ApiResponse<T> {
  status: boolean;
  data: T;
  message: string;
  errors?: Record<string, string>;
}
