export const PRIVY_APP_ID = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
export const ENVIRONMENT = process.env.NEXT_PUBLIC_ENVIRONMENT || "development";

//API

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3030",
  URI_API: "/api/v1.0",
};

//TODO: Esperar a tener el Token correcto
export const LOCAL_STORAGE_KEYS = {
  token: "access-token",
};

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
  LOGIN: "/login",
  REGISTER: "/register",
  ADD_PROPERTIES: "/add-properties",
  LIST_PROPERTIES: "/list-properties",
  PROFILE: "/profile",
  BOOKINGS: "/bookings",
};

export const MINT_ADDRESS =
  process.env.NEXT_PUBLIC_MINT_ADDRESS ||
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
// Default is mainnet address
