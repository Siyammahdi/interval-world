import { cookies } from "next/headers";
import { AUTH_COOKIE, AUTH_COOKIE_VALUE } from "@/lib/auth";

export async function isLoggedIn() {
  const jar = await cookies();
  return jar.get(AUTH_COOKIE)?.value === AUTH_COOKIE_VALUE;
}
