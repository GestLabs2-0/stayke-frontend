import type { Address, Signature } from "@solana/kit";
import axios from "axios";

import { PenaltySeverity } from "@GestLabs2-0/stayke-disputes";
import { BookingStatus } from "@GestLabs2-0/stayke-escrow";
import { objectToFormData } from "@/helpers/formData";
import { API_URL, LOCAL_STORAGE_KEYS } from "@/shared/constants";
import type { RegisterUser, UserProfileResponse } from "@/types/api/auth";
import type { BookingListResult, GetBookingsParams } from "@/types/api/booking";
import type {
  ApiConversation,
  ApiMessage,
  CreateConversationResult,
} from "@/types/api/chat";
import type {
  DiditProgressResponse,
  DiditSessionResponse,
} from "@/types/api/didit";
import type {
  DisputeListResult,
  GetDisputesParams,
} from "@/types/api/disputes";
import { DisputeJudgement, DisputeState } from "@/types/api/disputes";
import type {
  CreatePropertyRequest,
  EditPropertyRequest,
  GetPropertiesParams,
  PropertyListResult,
  PropertyResponse,
} from "@/types/api/property";
import type { PropertyDetail } from "@/types/api/propertyDetail";
import type {
  CreateReviewRequest,
  GetReviewsParams,
  Review,
  ReviewListResult,
} from "@/types/api/review";
import type { ApiBookedDateRange, GetBookedDatesParams } from "@/types/booking";
import type {
  ApiPaginatedResponse,
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
   * GET /bookings — lista de reservas del anfitrión con filtros opcionales.
   * Al pasar `status` se filtra por un estado concreto; al omitirlo se
   * devuelven todas las reservas.
   */
  async getBookings(params: GetBookingsParams): Promise<BookingListResult> {
    const result: BookingListResult = {
      data: null,
      meta: null,
      status: false,
      message: "",
    };

    try {
      const queryParams = new URLSearchParams();

      if (params.host) queryParams.append("host", params.host);
      if (params.guest) queryParams.append("guest", params.guest);
      if (params.status !== undefined) {
        queryParams.append("status", BookingStatus[params.status]);
      }
      if (params.checkIn !== undefined)
        queryParams.append("checkIn", String(params.checkIn));
      if (params.checkOut !== undefined)
        queryParams.append("checkOut", String(params.checkOut));
      if (params.limit !== undefined)
        queryParams.append("limit", String(params.limit));
      if (params.offset !== undefined)
        queryParams.append("offset", String(params.offset));

      const query = queryParams.toString();
      const url = query ? `/bookings?${query}` : "/bookings";

      const { data } = await this.httpClient.get({ url });

      const rawResponse = data as BookingListResult;
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

  /**
   * GET /bookings/booked-dates — booked date ranges for a property. The
   * backend window defaults to today → +6 months; pass from/to (YYYY-MM-DD)
   * to fetch a specific 6-month window.
   */
  // ── Reviews ──

  /**
   * POST /reviews — crea una reseña (de huésped o anfitrión) para una reserva.
   * `reviewerPda` lo inyecta el backend desde el JWT autenticado.
   */
  async createReview(body: CreateReviewRequest): Promise<ApiResponse<Review>> {
    const result: ApiResponse<Review> = {
      data: null,
      status: false,
      message: "",
    };

    try {
      const { data } = await this.httpClient.post({ url: "/reviews", body });

      const rawResponse = data as ApiResponse<Review>;
      if (rawResponse?.status) result.status = true;
      result.data = rawResponse.data;
      result.message = rawResponse.message;
      result.errors = rawResponse.errors;
      return result;
    } catch (error) {
      return handleApiError(error, result);
    }
  }

  /**
   * GET /reviews — lista reseñas con filtros opcionales. Se usa para comprobar
   * si el backend ya tiene una reseña (por ejemplo la del huésped) antes de crear.
   */
  async getReviews(params: GetReviewsParams): Promise<ReviewListResult> {
    const result: ReviewListResult = {
      data: null,
      meta: null,
      status: false,
      message: "",
    };

    try {
      const queryParams = new URLSearchParams();
      if (params.userPda) queryParams.append("userPda", params.userPda);
      if (params.bookingPda)
        queryParams.append("bookingPda", params.bookingPda);
      if (params.propertyPda)
        queryParams.append("propertyPda", params.propertyPda);
      if (params.reviewerPda)
        queryParams.append("reviewerPda", params.reviewerPda);
      if (params.score !== undefined)
        queryParams.append("score", String(params.score));
      if (params.limit !== undefined)
        queryParams.append("limit", String(params.limit));
      if (params.offset !== undefined)
        queryParams.append("offset", String(params.offset));

      const { data } = await this.httpClient.get({
        url: `/reviews?${queryParams.toString()}`,
      });

      const rawResponse = data as ReviewListResult;
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

  /**
   * GET /disputes - lista de disputas con filtros opcionales (protegido con JWT
   * dynamic). Los enums se envian por nombre ('Low', 'GuestFavored', 'OpenP2P'),
   * que es lo que espera el backend; la respuesta llega con valores numericos.
   */
  async getDisputes(params: GetDisputesParams): Promise<DisputeListResult> {
    const result: DisputeListResult = {
      data: null,
      meta: null,
      status: false,
      message: "",
    };

    try {
      const queryParams = new URLSearchParams();

      if (params.severity !== undefined) {
        queryParams.append("severity", PenaltySeverity[params.severity]);
      }
      if (params.judgement !== undefined) {
        queryParams.append("judgement", DisputeJudgement[params.judgement]);
      }
      if (params.state !== undefined) {
        queryParams.append("state", DisputeState[params.state]);
      }
      if (params.initiator) queryParams.append("initiator", params.initiator);
      if (params.accused) queryParams.append("accused", params.accused);
      if (params.initiatedAtDate) {
        queryParams.append("initiatedAtDate", params.initiatedAtDate);
      }
      if (params.limit !== undefined)
        queryParams.append("limit", String(params.limit));
      if (params.offset !== undefined)
        queryParams.append("offset", String(params.offset));

      const query = queryParams.toString();
      const url = query ? `/disputes?${query}` : "/disputes";

      const { data } = await this.httpClient.get({ url });

      const rawResponse = data as DisputeListResult;
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

  // ── Chat ──

  /**
   * GET /chat/conversations — lista de conversaciones del usuario autenticado.
   * Paginada, default limit 10. El backend resuelve el participante según el
   * token del llamador.
   */
  async listConversations(
    limit = 10,
    offset = 0,
  ): Promise<ApiPaginatedResponse<ApiConversation>> {
    const result: ApiPaginatedResponse<ApiConversation> = {
      data: null,
      meta: null,
      status: false,
      message: "",
    };

    try {
      const { data } = await this.httpClient.get({
        url: `/chat/conversations?limit=${limit}&offset=${offset}`,
      });

      const rawResponse = data as ApiPaginatedResponse<ApiConversation>;
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

  /**
   * GET /chat/conversations/:id/messages — mensajes de una conversación.
   * Paginada, default limit 20.
   */
  async listMessages(
    conversationId: number,
    limit = 20,
    offset = 0,
  ): Promise<ApiPaginatedResponse<ApiMessage>> {
    const result: ApiPaginatedResponse<ApiMessage> = {
      data: null,
      meta: null,
      status: false,
      message: "",
    };

    try {
      const { data } = await this.httpClient.get({
        url: `/chat/conversations/${conversationId}/messages?limit=${limit}&offset=${offset}`,
      });

      const rawResponse = data as ApiPaginatedResponse<ApiMessage>;
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

  /**
   * POST /chat/conversations — crea una conversación guest→host.
   * Si el backend responde 409 (la conversación guest-host ya existe) NO es un
   * fallo irreparable: el resultado devuelve `conflict: true` y el caller debe
   * recuperar la conversación existente vía `listConversations` en lugar de
   * mostrar un error al usuario.
   */
  async createConversation(
    hostId: string,
    propertyId?: number,
  ): Promise<CreateConversationResult> {
    const result: CreateConversationResult = {
      data: null,
      status: false,
      message: "",
    };

    try {
      const { data } = await this.httpClient.post({
        url: "/chat/conversations",
        body: propertyId !== undefined ? { hostId, propertyId } : { hostId },
      });

      const rawResponse = data as ApiResponse<ApiConversation>;
      result.status = rawResponse?.status === true;
      result.data = rawResponse?.data ?? null;
      result.message = rawResponse?.message ?? "";
      return result;
    } catch (error) {
      const axiosError = error as {
        response?: {
          status?: number;
          data?: { message?: string; errors?: string[] };
        };
      };

      if (axiosError.response?.status === 409) {
        // La conversación guest-host ya existe: distinguible para el caller.
        result.conflict = true;
        result.message =
          axiosError.response.data?.message || "La conversación ya existe.";
      } else {
        result.message =
          axiosError.response?.data?.message || "Ocurrió un error inesperado.";
      }
      result.errors = axiosError.response?.data?.errors || [];
      return result;
    }
  }
}

export const staykeApi = new StaykeApi(httpClient);
