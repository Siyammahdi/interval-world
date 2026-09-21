"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE } from "@/lib/auth";
import { extractSessionId, getApiBaseUrl } from "@/lib/api";

export type LoginState = {
  error?: string;
} | undefined;

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const loginId = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  const res = await fetch(`${getApiBaseUrl()}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ login_id: loginId, password }),
    cache: "no-store",
  });

  if (!res.ok) {
    return { error: "Invalid login ID or password." };
  }

  const sessionId = extractSessionId(res);
  if (!sessionId) {
    return { error: "Login succeeded but no session was returned." };
  }

  const jar = await cookies();
  jar.set(AUTH_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  redirect("/");
}

export async function logoutAction() {
  const jar = await cookies();
  const sessionId = jar.get(AUTH_COOKIE)?.value;
  if (sessionId) {
    try {
      await fetch(`${getApiBaseUrl()}/api/auth/logout/`, {
        method: "POST",
        headers: {
          Cookie: `iw_session=${sessionId}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
    } catch {
      // ignore network errors on logout
    }
  }
  jar.delete(AUTH_COOKIE);
  redirect("/web/my/auth/loginPage");
}
