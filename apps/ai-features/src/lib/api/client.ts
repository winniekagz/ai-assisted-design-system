import { redirectToSignIn } from '../auth/redirects';

export type ApiErrorCode =
  | 'validation'
  | 'unauthenticated'
  | 'forbidden'
  | 'conflict'
  | 'not_found'
  | 'server'
  | 'unknown';

export class ApiError extends Error {
  status: number;
  code: ApiErrorCode;
  details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = getErrorCode(status);
    this.details = details;
  }
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
  clerkSessionToken?: string | null;
  authRedirect?: boolean;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { clerkSessionToken, authRedirect = true, ...requestOptions } = options;
  const bearerToken = clerkSessionToken?.trim();
  const response = await fetch(`${API_URL}${path}`, {
    ...requestOptions,
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...requestOptions.headers,
      ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
    },
    body:
      options.body === undefined
        ? undefined
        : options.body instanceof FormData
          ? options.body
          : JSON.stringify(options.body),
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    if (response.status === 401 && authRedirect) {
      redirectToSignIn();
    }

    throw new ApiError(getErrorMessage(payload, response.status), response.status, payload);
  }

  return payload as T;
}

async function parseResponse(response: Response) {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function getErrorMessage(payload: unknown, status: number) {
  if (isRecord(payload)) {
    if (typeof payload.message === 'string') return payload.message;
    if (Array.isArray(payload.message)) return payload.message.join(', ');
    if (typeof payload.error === 'string') return payload.error;
  }

  if (status === 401) return 'Authentication required';
  if (status === 403) return 'You do not have permission to access this area';
  if (status === 404) return 'Resource not found';
  if (status >= 500) return 'Server error';
  return 'Request failed';
}

function getErrorCode(status: number): ApiErrorCode {
  if (status === 400) return 'validation';
  if (status === 401) return 'unauthenticated';
  if (status === 403) return 'forbidden';
  if (status === 409) return 'conflict';
  if (status === 404) return 'not_found';
  if (status >= 500) return 'server';
  return 'unknown';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
