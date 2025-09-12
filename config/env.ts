export const ENV = {
  API_BASE_URL:
    process.env.EXPO_PUBLIC_API_BASE_URL?.trim() ||
    "http://127.0.0.1:8000/api",
  REQUEST_TIMEOUT_MS: 25_000,
};
