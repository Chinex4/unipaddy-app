import axios, { AxiosError } from "axios";
import { ENV } from "@/config/env";
import { getToken, clearToken, clearUser } from "@/storage/auth";
import type { RootStore } from "@/store";
import { logout } from "@/redux/auth/auth.slice";
import { showError } from "@/components/ui/toast";

export const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: ENV.REQUEST_TIMEOUT_MS,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// we wire store later to avoid circular deps
let _store: RootStore | null = null;
export const attachStore = (store: RootStore) => {
  _store = store;
};

// Request: attach Bearer if present
api.interceptors.request.use(async (config) => {
  const token = await getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: global 401 handler + friendly error message
api.interceptors.response.use(
  (res) => res,
  async (err: AxiosError<any>) => {
    const status = err.response?.status;

    // Extract server error message (Laravel)
    const serverMessage =
      (err.response?.data as any)?.message ||
      (err.response?.data as any)?.error ||
      err.message;

    if (status === 401) {
      // token invalid/expired → clear and logout
      await clearToken();
      await clearUser();
      _store?.dispatch(logout());
      showError("Session expired. Please log in again.");
    } else {
      // generic error toast (keep it short)
      if (serverMessage) showError(serverMessage);
    }
    return Promise.reject(err);
  }
);
