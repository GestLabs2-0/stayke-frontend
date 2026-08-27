import type { Address } from "@solana/kit";
import axios from "axios";

import { LOCAL_STORAGE_KEYS, RELAYER_URL } from "@/shared/constants";
import type { CosignResponse } from "@/types/api/relayer";
import type { ApiResponse, HttpClientInterface } from "@/types/http";
import HttpClient from "./httpClient";

const httpClient = new HttpClient(RELAYER_URL, axios, LOCAL_STORAGE_KEYS);

export class RelayerApi {
  constructor(private readonly httpClient: HttpClientInterface) {}

  async cosign(txBase64: string, address: Address) {
    try {
      const { data } = await this.httpClient.post({
        url: "/cosign",
        body: { tx: txBase64, address },
      });

      const response = data as ApiResponse<CosignResponse>;

      if (response.data && response.status && response.data.tx) {
        return response.data.tx;
      }

      throw new Error("Invalid response from relayer");
    } catch (error) {
      const axiosError = error as {
        response?: { data?: { message?: string; error?: string } };
      };
      const message =
        axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        (error instanceof Error
          ? error.message
          : "Error cosigning transaction");
      throw new Error(message);
    }
  }
}

export const relayerApi = new RelayerApi(httpClient);
