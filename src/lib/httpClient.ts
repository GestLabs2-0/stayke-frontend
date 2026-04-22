import axios, { AxiosRequestConfig } from "axios";
import { API_CONFIG, LOCAL_STORAGE_KEYS } from "../constant";

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

const get = ({ url = "", options = {} }: GetParams) => {
  const { token } = getToken();

  return axios.get(readUrl(url), {
    headers: {
      ...HEADERS_DEFAULT,
      Authorization: `Bearer ${token}`,
    },
    ...options,
  });
};

const post = ({
  url = "",
  body = {},
  headers = {},
  options = {},
}: PostParams) => {
  const { token } = getToken();

  const { headers: headers_, ...restOptions } = options;

  return axios.post(readUrl(url), body, {
    headers: {
      ...HEADERS_DEFAULT,
      ...headers,
      ...headers_,
      Authorization: `Bearer ${token}`,
    },
    ...restOptions,
  });
};

const put = ({
  url = "",
  body = {},
  headers = {},
  options = {},
}: PutParams) => {
  const { token } = getToken();

  return axios.put(readUrl(url), body, {
    headers: {
      ...HEADERS_DEFAULT,
      ...headers,
      Authorization: `Bearer ${token}`,
    },
    ...options,
  });
};

const _delete = ({ url = "", headers = {}, options = {} }: DeleteParams) => {
  const { token } = getToken();

  return axios.delete(readUrl(url), {
    headers: {
      ...HEADERS_DEFAULT,
      ...headers,
      Authorization: `Bearer ${token}`,
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
