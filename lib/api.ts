const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY) || sessionStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY) || sessionStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string) {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    sessionStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  } catch {}
  try {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  } catch {}
}

export function clearTokens() {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    sessionStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch {}
  try {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  } catch {}
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("auth:logout"));
  }
}

export class ApiError extends Error {
  code: string;
  status: number;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

type Envelope<T> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: { code: string; message: string };
  meta?: { page?: number; per_page?: number; total_count?: number };
};

export type Page<T> = { items: T[]; total: number; page: number; perPage: number };

async function rawEnvelope<T>(
  path: string,
  options: RequestInit,
  withAuth: boolean
): Promise<Envelope<T>> {
  const headers = new Headers(options.headers);
  headers.set("Content-Type", "application/json");

  if (withAuth) {
    let token = getAccessToken();
    if (!token && getRefreshToken()) {
      await tryRefresh();
      token = getAccessToken();
    }
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    } else {
      clearTokens();
      throw new ApiError(
        401,
        "unauthorized",
        "Your admin session has expired or you are not signed in. Please log in at /admin/login."
      );
    }
  }

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });

  if (res.status === 204) return { success: true };

  // A proxy error page or a dropped connection is not JSON. Say something kind instead of crashing.
  const envelope: Envelope<T> | null = await res.json().catch(() => null);

  if (!envelope || !res.ok || !envelope.success) {
    throw new ApiError(
      res.status,
      envelope?.error?.code || "unknown_error",
      envelope?.error?.message ||
        (res.status === 429 ? "Too many attempts. Please wait a moment and try again." : "Something went wrong. Please try again.")
    );
  }

  return envelope;
}

async function rawRequest<T>(path: string, options: RequestInit, withAuth: boolean): Promise<T> {
  return (await rawEnvelope<T>(path, options, withAuth)).data as T;
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const data = await rawRequest<{ access_token: string; refresh_token: string }>(
      "/auth/refresh",
      { method: "POST", body: JSON.stringify({ refresh_token: refreshToken }) },
      false
    );
    setTokens(data.access_token, data.refresh_token);
    return true;
  } catch {
    clearTokens();
    return false;
  }
}


export async function request<T>(
  path: string,
  options: RequestInit = {},
  withAuth = false
): Promise<T> {
  try {
    return await rawRequest<T>(path, options, withAuth);
  } catch (err) {
    if (withAuth && err instanceof ApiError && err.status === 401) {
      const refreshed = await tryRefresh();
      if (refreshed) {
        return await rawRequest<T>(path, options, true);
      }
    }
    throw err;
  }
}

/** For paginated admin lists: the rows plus the total count. */
export async function listPage<T>(path: string, page = 1, perPage = 20): Promise<Page<T>> {
  const sep = path.includes("?") ? "&" : "?";
  const url = `${path}${sep}page=${page}&per_page=${perPage}`;
  let env: Envelope<T[]>;
  try {
    env = await rawEnvelope<T[]>(url, { method: "GET" }, true);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401 && (await tryRefresh())) {
      env = await rawEnvelope<T[]>(url, { method: "GET" }, true);
    } else {
      throw err;
    }
  }
  return {
    items: env.data ?? [],
    total: env.meta?.total_count ?? (env.data?.length ?? 0),
    page,
    perPage,
  };
}

export const api = {
  get: <T,>(path: string, withAuth = false) =>
    request<T>(path, { method: "GET" }, withAuth),
  post: <T,>(path: string, body?: unknown, withAuth = false) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }, withAuth),
  put: <T,>(path: string, body?: unknown, withAuth = false) =>
    request<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }, withAuth),
  delete: <T,>(path: string, withAuth = false) =>
    request<T>(path, { method: "DELETE" }, withAuth),
};
