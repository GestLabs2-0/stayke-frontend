import axios from "axios";
import { HttpClientInterface } from "../types/api";

class HttpClient implements HttpClientInterface {
  private baseUrl: string;
  private axiosInstance;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.axiosInstance = axios.create({});
  }
}
