import axios, { AxiosRequestConfig } from "axios";
import { API_CONFIG, LOCAL_STORAGE_KEYS } from "../constant";
import { getAccessToken } from "@privy-io/react-auth";

const URL_BASE = `${API_CONFIG.BASE_URL}${API_CONFIG.URI_API}`;

/**
 * @param {string}  url url a la cual consultar
 * esta funcion detecta si es una nueva url base (comienza con http:// o https://).
 * en caso de ser asi, retorna la url. en caso contrario, se asume que es un fragmento
 * de path por lo que se concatena con la constante URL_BASE
 **/

const readUrl = (url: string) => {
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `${URL_BASE}${url}`;
};

// Authorization Token
const getToken = () => {
  return {
    token: sessionStorage.getItem(LOCAL_STORAGE_KEYS.token),
  };
};

const HEADERS_DEFAULT = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

interface GetParams {
  url: string;
  options?: AxiosRequestConfig;
}

interface PostParams {
  url: string;
  body?: object;
  headers?: object;
  options?: AxiosRequestConfig;
}

interface PutParams {
  url: string;
  body?: object;
  headers?: object;
  options?: AxiosRequestConfig;
}

interface DeleteParams {
  url: string;
  headers?: object;
  options?: AxiosRequestConfig;
}

const get = async ({ url = "", options = {} }: GetParams) => {
  const authToken = await getAccessToken();

  return axios.get(readUrl(url), {
    headers: {
      ...HEADERS_DEFAULT,
      Authorization: `Bearer ${authToken}`,
    },
    ...options,
  });
};

const post = async ({
  url = "",
  body = {},
  headers = {},
  options = {},
}: PostParams) => {
  const authToken = await getAccessToken();

  const { headers: headers_, ...restOptions } = options;

  return axios.post(readUrl(url), body, {
    headers: {
      ...HEADERS_DEFAULT,
      ...headers,
      ...headers_,
      Authorization: `Bearer ${authToken}`,
    },
    ...restOptions,
  });
};

const put = async ({
  url = "",
  body = {},
  headers = {},
  options = {},
}: PutParams) => {
  const authToken = await getAccessToken();

  return axios.put(readUrl(url), body, {
    headers: {
      ...HEADERS_DEFAULT,
      ...headers,
      Authorization: `Bearer ${authToken}`,
    },
    ...options,
  });
};

const _delete = async ({
  url = "",
  headers = {},
  options = {},
}: DeleteParams) => {
  const authToken = await getAccessToken();

  return axios.delete(readUrl(url), {
    headers: {
      ...HEADERS_DEFAULT,
      ...headers,
      Authorization: `Bearer ${authToken}`,
    },
    ...options,
  });
};

const httpClient = {
  get,
  post,
  put,
  delete: _delete,
};

export default httpClient;
