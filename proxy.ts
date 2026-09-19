import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  AUTH_COOKIE,
  AUTH_COOKIE_VALUE,
  isAuthOnlyPublicPath,
  isPublicPath,
} from "@/lib/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(AUTH_COOKIE)?.value;
  const authenticated = session === AUTH_COOKIE_VALUE;

  // Logged-in users should not stay on login / signup screens
  if (authenticated && isAuthOnlyPublicPath(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Guests may only visit public routes
  if (!authenticated && !isPublicPath(pathname)) {
    const loginUrl = new URL("/web/my/auth/loginPage", request.url);
    loginUrl.searchParams.set("next", pathname);
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
