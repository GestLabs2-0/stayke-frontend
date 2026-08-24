import { getDefaultClient } from "@dynamic-labs-sdk/client";
import type { Axios, AxiosError } from "axios";

import type {
  ApiResponse,
  DeleteParams,
  GetParams,
  HttpClientInterface,
  LocalStorageKeys,
  PostParams,
  PutParams,
} from "../types/http";

export class HttpClient implements HttpClientInterface {
  private readonly default_headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  };

  constructor(
    private readonly baseUrl: string,
    private readonly http: Axios,
    private readonly localStorageKeys: LocalStorageKeys,
  ) {}

  /**
   * @returns devuelve un accessToken usado para enviar al backend la autorizacion
   */
  getAuthorization() {
    return {
      token:
        getDefaultClient().token ??
        localStorage.getItem(this.localStorageKeys.accessToken),
    };
  }

  /**
   * Builds the request headers, omitting the JSON content-type when the body is
   * a FormData instance so axios can set the multipart boundary on its own.
   */
  private composeHeaders(customHeaders: object = {}, omitContentType = false) {
    const { token } = this.getAuthorization();

    const headers: Record<string, unknown> = { ...this.default_headers };

    if (omitContentType) {
      delete headers["Content-Type"];
    }

    return {
      ...headers,
      ...customHeaders,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  }

  /**
   * @param {string}  uri Detecta si estamos usando una URI o es una nueva URL base
   * (comienza con http:// o https://). En caso de ser asi, retorna la url,
   * en caso contrario, se asume que es un fragmento
   * de path por lo que se concatena con la url base del cliente
   **/
  readUrl(uri: string) {
    return uri.startsWith("http://") || uri.startsWith("https://")
      ? uri
      : `${this.baseUrl}${uri}`;
  }

  /**
   * @param {GetParams} options recibe una url o uri, los headers de las peticiones y opciones http
   */
  async get({ url = "", headers = {}, options = {} }: GetParams) {
    const { token } = this.getAuthorization();

    return this.http.get(this.readUrl(url), {
      headers: {
        ...this.default_headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      ...options,
    });
  }

  async post({ url = "", body, headers = {}, options = {} }: PostParams) {
    const { headers: headers_, ...restOptions } = options;
    const isFormData = body instanceof FormData;

    return this.http.post(this.readUrl(url), body, {
      headers: this.composeHeaders({ ...headers, ...headers_ }, isFormData),
      ...restOptions,
    });
  }

  async put({ url = "", body = {}, headers = {}, options = {} }: PutParams) {
    const isFormData = body instanceof FormData;

    return this.http.put(this.readUrl(url), body, {
      headers: this.composeHeaders(headers, isFormData),
      ...options,
    });
  }

  async patch({ url = "", body = {}, headers = {}, options = {} }: PutParams) {
    const { token } = this.getAuthorization();

    return this.http.patch(this.readUrl(url), body, {
      headers: {
        ...this.default_headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      ...options,
    });
  }

  async delete({ url = "", headers = {}, options = {} }: DeleteParams) {
    const { token } = this.getAuthorization();

    return this.http.delete(this.readUrl(url), {
      headers: {
        ...this.default_headers,
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
      ...options,
    });
  }
}

export default HttpClient;

export function handleApiError<T>(
  error: unknown,
  result: ApiResponse<T>,
): ApiResponse<T> {
  const axiosError = error as AxiosError<{
    message?: string;
    errors?: string[];
  }>;
  console.log(axiosError);
  const message = axiosError.response?.data?.message;
  result.message = message || "Ocurrió un error inesperado.";
  result.errors = axiosError.response?.data?.errors || [];
  return result;
}
