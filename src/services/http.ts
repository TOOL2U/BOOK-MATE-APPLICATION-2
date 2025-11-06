import { BASE_URL, REQUEST_TIMEOUT_MS, RETRIES } from "../config/env";

function withTimeout<T>(p: Promise<T>, ms = REQUEST_TIMEOUT_MS): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error(`Timeout ${ms}ms`)), ms);
    p.then((v) => { clearTimeout(id); resolve(v); })
     .catch((e) => { clearTimeout(id); reject(e); });
  });
}

async function coreFetch(path: string, init?: RequestInit) {
  const url = path.startsWith("http") ? path : `${BASE_URL}${path}`;
  const res = await withTimeout(fetch(url, {
    ...init,
    headers: {
      "Accept": "application/json",
      ...(init?.headers ?? {}),
    },
  }));
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} :: ${body?.slice(0,300)}`);
  }
  return res.json();
}

export async function getJson<T>(path: string): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i <= RETRIES; i++) {
    try { 
      if (i > 0) {
        // Exponential backoff: 300ms delay on retry
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      return await coreFetch(path); 
    }
    catch (e) { lastErr = e; }
  }
  throw lastErr;
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i <= RETRIES; i++) {
    try {
      if (i > 0) {
        // Exponential backoff: 300ms delay on retry
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      return await coreFetch(path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (e) { lastErr = e; }
  }
  throw lastErr;
}