import type { Address, Signature } from "@solana/kit";
import axios from "axios";

import { objectToFormData } from "@/helpers/formData";
import { API_URL, LOCAL_STORAGE_KEYS } from "@/shared/constants";
import type { RegisterUser, UserProfileResponse } from "@/types/api/auth";
import type {
  DiditProgressResponse,
  DiditSessionResponse,
} from "@/types/api/didit";
import type {
  CreatePropertyRequest,
  EditPropertyRequest,
  GetPropertiesParams,
  PropertyListResult,
  PropertyResponse,
} from "@/types/api/property";
import type { PropertyDetail } from "@/types/api/propertyDetail";
import type { ApiBookedDateRange, GetBookedDatesParams } from "@/types/booking";
import type {
  ApiResponse,
  HttpClientInterface,
  LoginResponse,
} from "@/types/http";
import HttpClient, { handleApiError } from "./httpClient";

const httpClient = new HttpClient(API_URL, axios, LOCAL_STORAGE_KEYS);

export class StaykeApi {
  constructor(private readonly httpClient: HttpClientInterface) {}

  async login(signature: Signature, pubkey: Address) {
    const result: ApiResponse<LoginResponse> = {
      data: null,
      status: false,
      message: "",
    };
    try {
      const { data } = await this.httpClient.post({
        url: "/auth/login",
        body: { signature, pubkey },
      });

      // Backend now returns raw shape: { access_token, token_type, expires_in }
      // NOT wrapped in { status, data } structure
      const rawResponse = data as ApiResponse<LoginResponse>;

      if (rawResponse?.status) {
        result.status = true;
      }
      result.data = rawResponse.data;

      result.message = rawResponse.message; // No message from raw response
      return result;
    } catch (error) {
      return handleApiError(error, result);
    }
  }

  async register(body: RegisterUser) {
    const result: ApiResponse<UserProfileResponse> = {
      data: null,
      status: false,
      message: "",
    };

    try {
      const { data } = await this.httpClient.post({
        url: "/auth/register",
        body,
      });

      // Backend now returns raw shape: { access_token, token_type, expires_in }
      // NOT wrapped in { status, data } structure
      const rawResponse = data as ApiResponse<UserProfileResponse>;

      if (rawResponse?.status) {
        result.status = true;
      }
      result.errors = rawResponse.errors;
      result.data = rawResponse.data;

      result.message = rawResponse.message; // No message from raw response
      return result;
    } catch (error) {
      return handleApiError(error, result);
    }
  }

  async me() {
    const result: ApiResponse<UserProfileResponse> = {
      data: null,
      status: false,
      message: "",
    };

    try {
      const { data } = await this.httpClient.post({
        url: "/auth/me",
      });

      // Backend now returns raw shape: { access_token, token_type, expires_in }
      // NOT wrapped in { status, data } structure
      const rawResponse = data as ApiResponse<UserProfileResponse>;

      if (rawResponse?.status) {
        result.status = true;
      }
      result.data = rawResponse.data;

      result.message = rawResponse.message; // No message from raw response
      return result;
    } catch (error) {
      return handleApiError(error, result);
    }
  }

  async createDiditSession() {
    const result: ApiResponse<DiditSessionResponse> = {
      data: null,
      status: false,
      message: "",
    };

    try {
      const { data } = await this.httpClient.post({
        url: "/verification/start",
      });

      const rawResponse = data as ApiResponse<DiditSessionResponse>;

      if (rawResponse?.status) {
        result.status = true;
      }
      result.data = rawResponse.data;

      result.message = rawResponse.message;
      return result;
    } catch (error) {
      return handleApiError(error, result);
    }
  }

  async getDiditProgress() {
    const result: ApiResponse<DiditProgressResponse> = {
      data: null,
      status: false,
      message: "",
    };

    try {
      const { data } = await this.httpClient.post({
        url: "/verification/progress",
      });

      const rawResponse = data as ApiResponse<DiditProgressResponse>;

      if (rawResponse?.status) {
        result.status = true;
      }
      result.data = rawResponse.data;

      result.message = rawResponse.message;
      return result;
    } catch (error) {
      return handleApiError(error, result);
    }
  }

  // ── Properties ──

  async createProperty(body: CreatePropertyRequest, image?: File) {
    const result: ApiResponse<PropertyResponse> = {
      data: null,
      status: false,
      message: "",
    };

    try {
      const formData = objectToFormData(body);
      if (image) {
        formData.append("image", image);
      }

      const { data } = await this.httpClient.post({
        url: "/properties",
        body: formData,
      });

      const rawResponse = data as ApiResponse<PropertyResponse>;

      if (rawResponse?.status) {
        result.status = true;
      }
      result.data = rawResponse.data;
      result.message = rawResponse.message;
      return result;
    } catch (error) {
      return handleApiError(error, result);
    }
  }

  async getProperties(
    params?: GetPropertiesParams,
  ): Promise<PropertyListResult> {
    const result: PropertyListResult = {
      data: null,
      meta: null,
      status: false,
      message: "",
    };

    try {
      const queryParams = new URLSearchParams();

      if (params?.hostId) queryParams.append("hostId", params.hostId);
      if (params?.isActive !== undefined)
        queryParams.append("isActive", String(params.isActive));
      if (params?.location) queryParams.append("location", params.location);
      if (params?.checkIn) queryParams.append("checkIn", params.checkIn);
      if (params?.checkOut) queryParams.append("checkOut", params.checkOut);
      if (params?.guests) queryParams.append("guests", String(params.guests));
      if (params?.minPrice)
        queryParams.append("minPrice", String(params.minPrice));
      if (params?.maxPrice)
        queryParams.append("maxPrice", String(params.maxPrice));
      if (params?.page) queryParams.append("page", String(params.page));
      if (params?.limit) queryParams.append("limit", String(params.limit));

      const query = queryParams.toString();
      const url = query ? `/properties?${query}` : "/properties";

      const { data } = await this.httpClient.get({ url });

      const rawResponse = data as PropertyListResult;
      result.status = rawResponse?.status === true;
      result.data = rawResponse?.data ?? null;
      result.meta = rawResponse?.meta ?? null;
      result.message = rawResponse?.message ?? "";
      return result;
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string; errors?: string[] } };
      };
      result.message =
        axiosError.response?.data?.message || "Ocurrió un error inesperado.";
      result.errors = axiosError.response?.data?.errors || [];
      return result;
    }
  }

  async getPropertyById(idPda: string): Promise<ApiResponse<PropertyDetail>> {
    const result: ApiResponse<PropertyDetail> = {
      data: null,
      status: false,
      message: "",
    };

    try {
      const { data } = await this.httpClient.get({
        url: `/properties/${idPda}`,
      });

      const rawResponse = data as ApiResponse<PropertyDetail>;

      if (rawResponse?.status) {
        result.status = true;
        result.data = rawResponse.data
          ? {
              ...rawResponse.data,
              amenities: rawResponse.data.amenities ?? [],
              reviews: rawResponse.data.reviews ?? [],
            }
          : null;
      }
      result.message = rawResponse?.message ?? "";
      return result;
    } catch (error) {
      return handleApiError(error, result);
    }
  }

  async updateProperty(id: string, body: EditPropertyRequest, image?: File) {
    const result: ApiResponse<PropertyResponse> = {
      data: null,
      status: false,
      message: "",
    };

    try {
      const formData = objectToFormData(body);
      if (image) {
        formData.append("image", image);
      }

      const { data } = await this.httpClient.put({
        url: `/properties/${id}`,
        body: formData,
      });

      const rawResponse = data as ApiResponse<PropertyResponse>;

      if (rawResponse?.status) {
        result.status = true;
      }
      result.data = rawResponse.data;
      result.message = rawResponse.message;
      return result;
    } catch (error) {
      return handleApiError(error, result);
    }
  }
  // ── Bookings ──

  /**
   * GET /bookings/booked-dates — booked date ranges for a property. The
   * backend window defaults to today → +6 months; pass from/to (YYYY-MM-DD)
   * to fetch a specific 6-month window.
   */
  async getBookedDates(
    params: GetBookedDatesParams,
  ): Promise<ApiResponse<ApiBookedDateRange[]>> {
    const result: ApiResponse<ApiBookedDateRange[]> = {
      data: null,
      status: false,
      message: "",
    };

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("property", params.property);
      if (params.from) queryParams.append("from", params.from);
      if (params.to) queryParams.append("to", params.to);

      const url = `/bookings/booked-dates?${queryParams.toString()}`;

      const { data } = await this.httpClient.get({ url });

      const rawResponse = data as ApiResponse<ApiBookedDateRange[]>;
      result.status = rawResponse?.status === true;
      result.data = rawResponse?.data ?? null;
      result.message = rawResponse?.message ?? "";
      return result;
    } catch (error) {
      return handleApiError(error, result);
    }
  }
}

export const staykeApi = new StaykeApi(httpClient);
