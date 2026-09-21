import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/auth";
import { apiFetch, ApiError } from "@/lib/api";

export async function getSessionId() {
  const jar = await cookies();
  return jar.get(AUTH_COOKIE)?.value ?? null;
}

export async function isLoggedIn() {
  const sessionId = await getSessionId();
  if (!sessionId) return false;
  try {
    await apiFetch("/api/auth/me/", { sessionId });
    return true;
  } catch (err) {
    if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
      return false;
    }
    // If API is down, treat presence of cookie as logged-in for gate UX
    return Boolean(sessionId);
  }
}
