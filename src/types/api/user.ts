import { DocType } from "@/src/generated/stayke_core";

export interface RegisterUser {
  country: string;
  dni: string;
  documentType: string;
  email: string;
  firstName: string;
  identityAddr: string;
  // address: string;
  image: string;
  lastName: string;
  phone: string;
  privyId: string;
  profileAddr: string;
  reputationAddr: string;
  // documentNumber: string | number;
  wallet: string;
}

export interface RegisterResponse {
  banned: boolean;

  country: string;

  dni: string;

  documentType: DocType;

  email: string;

  firstName: string;

  id: number;

  identityAddr: string;

  image: string;

  isActive: boolean;

  lastName: string;

  phone: string;

  privyId: string;

  reputationProfileAddr: string;

  userProfileAddr: string;

  verified: boolean;

  // Pubkey

  wallet: string;
}
