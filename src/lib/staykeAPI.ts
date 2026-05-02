import { HttpClientI, ResponseI } from "../types/api";
import { UserType, RegisterUser } from "../types/api/user";
import httpClient from "./httpClient";
import { AxiosError, AxiosResponse } from "axios";

function handleError<T>(error: unknown, result: ResponseI<T>): ResponseI<T> {
  const axiosError = error as AxiosError<{ message?: string }>;
  const message = axiosError.response?.data?.message;
  result.message = message || "Ocurrió un error inesperado.";
  return result;
}

type AxiosStaykeResponse<T> = AxiosResponse<ResponseI<T>>;

export class StaykeAPI {
  private httpClient: HttpClientI;

  constructor(httpClient: HttpClientI) {
    this.httpClient = httpClient;
  }

  async getUserProfile(address: string) {
    const result: ResponseI<UserType> = {
      data: null,
      status: false,
      message: "",
    };
    try {
      const response = await this.httpClient.get<AxiosStaykeResponse<UserType>>(
        {
          url: `/user/${address}`,
        }
      );
      const { data, status, message } = response.data;

      if (status) {
        result.status = true;
        result.data = data;
      }

      result.message = message;
      return result;
    } catch (error) {
      return handleError(error, result);
    }
  }

  async registerUser(userData: RegisterUser) {
    const result: ResponseI<UserType> = {
      data: null,
      status: false,
      message: "",
    };

    try {
      const response = await this.httpClient.post<
        AxiosStaykeResponse<UserType>
      >({
        url: "/user/register",
        body: userData,
      });
      const { data, status, message } = response.data;

      if (status) {
        result.status = true;
        result.data = data;
      }

      result.message = message;
      return result;
    } catch (error) {
      return handleError(error, result);
    }
  }

  /**
   * Requests the Didit identity-verification URL for the authenticated user.
   * The backend derives the user identity from the Privy JWT token attached
   * automatically by the httpClient.
   */
  async getDiditUrl() {
    const result: ResponseI<{ url: string }> = {
      data: null,
      status: false,
      message: "",
    };

    try {
      const response = await this.httpClient.post<
        AxiosStaykeResponse<{ url: string }>
      >({
        url: "/user/didit-session",
      });
      const { data, status, message } = response.data;

      if (status) {
        result.status = true;
        result.data = data;
      }

      result.message = message;
      return result;
    } catch (error) {
      return handleError(error, result);
    }
  }
}

export default new StaykeAPI(httpClient);
