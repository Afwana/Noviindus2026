import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import {
  applyAuthResponse,
  clearAuth,
  getAccessToken,
  getRefreshToken,
} from "./auth-storage";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
const REFRESH_PATH = process.env.NEXT_PUBLIC_AUTH_REFRESH_PATH || "/auth/refresh";
const REFRESH_FIELD =
  process.env.NEXT_PUBLIC_REFRESH_TOKEN_FIELD || "refresh_token";

const PUBLIC_PATHS = [
  "/auth/send-otp",
  "/auth/verify-otp",
  "/auth/create-profile",
  REFRESH_PATH,
];

export const api = axios.create({ baseURL });
const rawApi = axios.create({ baseURL });

function getPath(url?: string): string {
  if (!url) return "";
  if (url.includes("://")) {
    try {
      return new URL(url).pathname;
    } catch {
      return "";
    }
  }
  return url.split("?")[0] || "";
}

function isPublicPath(path: string): boolean {
  return PUBLIC_PATHS.some((publicPath) => path === publicPath);
}

type RetryableRequest = InternalAxiosRequestConfig & { _retry?: boolean };
let refreshingPromise: Promise<string | null> | null = null;

async function refreshToken(): Promise<string | null> {
  if (!refreshingPromise) {
    refreshingPromise = (async () => {
      const refreshTokenValue = getRefreshToken();
      if (!refreshTokenValue) {
        clearAuth();
        return null;
      }
      try {
        const formData = new FormData();
        formData.append(REFRESH_FIELD, refreshTokenValue);
        const response = await rawApi.post(REFRESH_PATH, formData);
        applyAuthResponse(response.data);
        return getAccessToken();
      } catch {
        clearAuth();
        return null;
      } finally {
        refreshingPromise = null;
      }
    })();
  }

  return refreshingPromise;
}

api.interceptors.request.use((config) => {
  const path = getPath(config.url);
  if (isPublicPath(path)) {
    return config;
  }

  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;
    if (!originalRequest || error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const path = getPath(originalRequest.url);
    if (path === getPath(REFRESH_PATH) || isPublicPath(path)) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const newAccessToken = await refreshToken();
    if (!newAccessToken) {
      return Promise.reject(error);
    }

    originalRequest.headers = originalRequest.headers ?? {};
    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    return api(originalRequest);
  },
);
