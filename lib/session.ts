import { cookies } from "next/headers";
import { AUTH_COOKIE, isValidSession } from "@/lib/auth";

export async function getSessionId() {
  const jar = await cookies();
  return jar.get(AUTH_COOKIE)?.value ?? null;
}

export async function isLoggedIn() {
  return isValidSession(await getSessionId());
}
