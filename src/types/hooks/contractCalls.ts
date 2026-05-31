import { Address } from "@solana/kit";

export interface RegisterUserRes {
  identity: Address;
  userProfile: Address;
  reputationProfile: Address;
}

export interface CreatePropertyOnChainRes {
  propertyAddr: Address;
}
