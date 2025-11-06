// Edit BASE_URL once and the whole app follows.
export const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  "https://accounting.siamoon.com";

export const REQUEST_TIMEOUT_MS = 20_000;   // 20s
export const RETRIES = 1;                   // one retry on failure