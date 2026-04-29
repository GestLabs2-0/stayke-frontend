import axios from "axios";
import { API_CONFIG } from "../constant";
import { getAccessToken } from "@privy-io/react-auth";
import {
  DeleteParams,
  GetParams,
  HttpClientI,
  PostParams,
  PutParams,
} from "../types/api";

const URL_BASE = `${API_CONFIG.BASE_URL}${API_CONFIG.URI_API}`;

const HEADERS_DEFAULT = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

/**
 * @param {string}  url url a la cual consultar
 * esta funcion detecta si es una nueva url base (comienza con http:// o https://).
 * en caso de ser asi, retorna la url. en caso contrario, se asume que es un fragmento
 * de path por lo que se concatena con la constante URL_BASE
 **/

export class HttpClient implements HttpClientI {
  private URL_BASE: string;
  private HEADERS_DEFAULT: object;

  constructor(
    urlBase: string = URL_BASE,
    headersDefault: object = HEADERS_DEFAULT
  ) {
    this.URL_BASE = urlBase;
    this.HEADERS_DEFAULT = headersDefault;
  }

  readUrl(url: string) {
    return url.startsWith("http://") || url.startsWith("https://")
      ? url
      : `${this.URL_BASE}${url}`;
  }

  async get<T>({ url = "", options = {} }: GetParams): Promise<T> {
    const authToken = await getAccessToken();

    return axios.get(this.readUrl(url), {
      headers: {
        ...this.HEADERS_DEFAULT,
        Authorization: `Bearer ${authToken}`,
      },
      ...options,
    });
  }

  async post<T>({
    url = "",
    body = {},
    headers = {},
    options = {},
  }: PostParams): Promise<T> {
    const authToken = await getAccessToken();

    const { headers: headers_, ...restOptions } = options;

    return axios.post(this.readUrl(url), body, {
      headers: {
        ...this.HEADERS_DEFAULT,
        ...headers,
        ...headers_,
        Authorization: `Bearer ${authToken}`,
      },
      ...restOptions,
    });
  }

  async put<T>({
    url = "",
    body = {},
    headers = {},
    options = {},
  }: PutParams): Promise<T> {
    const authToken = await getAccessToken();

    return axios.put(this.readUrl(url), body, {
      headers: {
        ...this.HEADERS_DEFAULT,
        ...headers,
        Authorization: `Bearer ${authToken}`,
      },
      ...options,
    });
  }

  async delete<T>({
    url = "",
    headers = {},
    options = {},
  }: DeleteParams): Promise<T> {
    const authToken = await getAccessToken();

    return axios.delete(this.readUrl(url), {
      headers: {
        ...this.HEADERS_DEFAULT,
        ...headers,
        Authorization: `Bearer ${authToken}`,
      },
      ...options,
    });
  }
}

export default new HttpClient();
