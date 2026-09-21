/** Server-side API base URL for Django (BFF / RSC). */
export function getApiBaseUrl() {
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://127.0.0.1:4000"
  ).replace(/\/$/, "");
}

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

type ApiFetchOptions = RequestInit & {
  sessionId?: string | null;
};

/** Low-level fetch to Django. Pass sessionId to forward iw_session cookie. */
export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { sessionId, headers, ...rest } = options;
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const nextHeaders = new Headers(headers);
  if (!nextHeaders.has("Content-Type") && rest.body) {
    nextHeaders.set("Content-Type", "application/json");
  }
  if (sessionId) {
    nextHeaders.set("Cookie", `iw_session=${sessionId}`);
  }

  const res = await fetch(url, {
    ...rest,
    headers: nextHeaders,
    cache: "no-store",
  });

  const text = await res.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const detail =
      typeof data === "object" && data && "detail" in data
        ? String((data as { detail: unknown }).detail)
        : `API ${res.status}`;
    throw new ApiError(detail, res.status, data);
  }

  return data as T;
}

/** Parse Django Set-Cookie session value from a Response. */
export function extractSessionId(res: Response): string | null {
  const raw = res.headers.getSetCookie?.() ?? [];
  for (const cookie of raw) {
    const match = cookie.match(/(?:^|,\s*)iw_session=([^;]+)/);
    if (match) return match[1];
  }
  // Node fetch may expose only get('set-cookie')
  const single = res.headers.get("set-cookie");
  if (single) {
    const match = single.match(/iw_session=([^;]+)/);
    if (match) return match[1];
  }
  return null;
}
