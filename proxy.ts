import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_COOKIE,
  LOGIN_PATH,
  isAuthOnlyPublicPath,
  isPublicPath,
  isValidSession,
} from "@/lib/auth";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const authenticated = isValidSession(request.cookies.get(AUTH_COOKIE)?.value);

  // Logged-in users should not stay on login / signup screens
  if (authenticated && isAuthOnlyPublicPath(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Guests may only visit public routes
  if (!authenticated && !isPublicPath(pathname)) {
    const loginUrl = new URL(LOGIN_PATH, request.url);
    if (pathname !== "/") loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except static assets and Next internals.
     */
    "/((?!_next/static|_next/image|favicon.ico|images/|videos/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|mp4|webm|m4v)$).*)",
  ],
};
