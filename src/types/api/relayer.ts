export interface CosignResponse {
  tx: string;
  feePayer?: string;
}

export interface CosignRequest {
  tx: string;
  address?: string;
}
