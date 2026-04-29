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
};
