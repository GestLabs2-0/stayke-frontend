import type { Address, Signature } from "@solana/kit";
import axios from "axios";

import { API_URL, LOCAL_STORAGE_KEYS } from "@/shared/constants";
import type { RegisterUser, UserProfileResponse } from "@/types/api/auth";
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
}

export const staykeApi = new StaykeApi(httpClient);
