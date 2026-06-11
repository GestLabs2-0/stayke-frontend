import { DocType } from "@GestLabs2-0/stayke-core";
import type { IProperties } from "./properties";

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

export enum VerificationProgress {
  Failed = "VerificationFailed",
  InProgress = "InProgress",
  NotVerified = "NotVerified",
  Verified = "Verified",
}

export interface UserType {
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

  verified: VerificationProgress;

  // Pubkey

  wallet: string;

  properties: IProperties[];
}
