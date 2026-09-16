import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE, AUTH_COOKIE_VALUE, isPublicAuthPath } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(AUTH_COOKIE)?.value;
  const authenticated = session === AUTH_COOKIE_VALUE;

  if (authenticated && isPublicAuthPath(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (!authenticated && !isPublicAuthPath(pathname)) {
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
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$).*)",
  ],
};
