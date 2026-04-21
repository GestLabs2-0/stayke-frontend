import { API_CONFIG } from "../constant";
import { ApiResponse } from "../types/api";

class ApiServices {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const config: RequestInit = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    const response = await fetch(`${this.baseUrl}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => {});
      let errorMsg =
        errorData.message || `HTTP Error Status ${errorData.status}`;

      if (errorData.errors) {
        const details = Object.entries(errorData.errors)
          .map(([field, error]) => `${field}: ${error}`)
          .join("\n");

        errorMsg += `\n${details}`;
      }
      throw new Error(errorMsg);
    }

    const data = await response.json();
    return data as ApiResponse<T>;
  }

  async get<T>(endpoint: string) {
    await this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, body: unknown) {
    await this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }
  async put<T>(endpoint: string, body: unknown) {
    await this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }
  async delete<T>(endpoint: string, body: unknown) {
    await this.request<T>(endpoint, {
      method: "DELETE",
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
  }
}

export const ApiService = new ApiServices();
