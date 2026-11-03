const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000").replace(/\/$/, "");

let cachedToken: { value: string; expiresAt: number } | null = null;

// asks better auth for a short lived jwt, the express api checks it
async function getToken(): Promise<string | null> {
  if (cachedToken && cachedToken.expiresAt > Date.now()) return cachedToken.value;

  const res = await fetch("/api/auth/token", { credentials: "include" });
  if (!res.ok) return null;
  const data = (await res.json()) as { token?: string };
  if (!data.token) return null;

  // token lives 1h, refresh a bit earlier
  cachedToken = { value: data.token, expiresAt: Date.now() + 50 * 60 * 1000 };
  return data.token;
}

export function clearToken() {
  cachedToken = null;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
}

export async function api<T>(path: string, { method = "GET", body, auth = false }: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";

  if (auth) {
    const token = await getToken();
    if (!token) throw new ApiError("Please log in first", 401);
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    if (res.status === 401) clearToken();
    throw new ApiError((data as { message?: string }).message || "Request failed", res.status);
  }
  return data as T;
}

export { API_URL };
