export type SessionUser = {
  id: string;
  displayName: string | null;
  email: string | null;
  pictureUrl: string | null;
};

export type RemoteProgress = {
  revision: number;
  updatedAt: string;
  payload: string;
};

export type ProgressReceipt = {
  revision: number;
  updatedAt: string;
};

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

const readCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[2]) : null;
};

let csrfFallback: string | null = null;

async function csrfToken(): Promise<string | null> {
  const cookie = readCookie('XSRF-TOKEN');
  if (cookie) return cookie;
  if (csrfFallback) return csrfFallback;
  try {
    const response = await fetch('/api/csrf', { credentials: 'same-origin' });
    if (!response.ok) return null;
    const body = (await response.json()) as { token: string };
    csrfFallback = body.token;
    return body.token;
  } catch {
    return null;
  }
}

async function buildHeaders(init: RequestInit): Promise<Headers> {
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');
  if (init.body) headers.set('Content-Type', 'application/json');
  const token = readCookie('XSRF-TOKEN') ?? csrfFallback;
  if (token && init.method && init.method !== 'GET') headers.set('X-XSRF-TOKEN', token);
  return headers;
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(path, {
    credentials: 'same-origin',
    ...init,
    headers: await buildHeaders(init),
  });
  if (!response.ok) {
    throw new ApiError(response.status, `${init.method ?? 'GET'} ${path} → ${response.status}`);
  }
  return (await response.json()) as T;
}

export async function fetchProviders(): Promise<string[]> {
  try {
    const body = await request<{ providers: string[] }>('/api/auth/providers');
    return body.providers;
  } catch {
    return [];
  }
}

export async function fetchMe(): Promise<SessionUser | null> {
  try {
    return await request<SessionUser>('/api/me');
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) return null;
    throw error;
  }
}

export async function fetchProgress(): Promise<RemoteProgress | null> {
  try {
    return await request<RemoteProgress>('/api/progress');
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

export async function pushProgress(payload: string, updatedAt: string): Promise<ProgressReceipt> {
  const token = await csrfToken();
  return request<ProgressReceipt>('/api/progress', {
    method: 'PUT',
    headers: token ? { 'X-XSRF-TOKEN': token } : undefined,
    body: JSON.stringify({ payload, updatedAt }),
  });
}

export function loginUrl(provider: string): string {
  return `/oauth2/authorization/${provider}`;
}

export async function signOut(): Promise<void> {
  const token = await csrfToken();
  await fetch('/logout', {
    method: 'POST',
    credentials: 'same-origin',
    headers: token ? { 'X-XSRF-TOKEN': token } : undefined,
  });
}

export const PROVIDER_LABELS: Record<string, string> = {
  google: 'Google',
  github: 'GitHub',
};
