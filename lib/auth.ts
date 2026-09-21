/** Auth cookie holds Django session key (forwarded via BFF). */
export const AUTH_COOKIE = "iw_session";

/** Login / signup pages — logged-in users are redirected away from these. */
export const PUBLIC_AUTH_PATHS = [
  "/web/my/auth/loginPage",
  "/web/my/account/createProfileOrJoin",
  "/web/my/account/forgotSignInInfo",
] as const;

/** Marketing / directory pages anyone can open (logged in or not). */
const PUBLIC_CONTENT_PREFIXES = [
  "/",
  "/resort-directory",
  "/resort-page",
  "/single-resort-page",
  "/available-unit",
  "/checkout",
  "/web/my/info",
  "/web/cs",
  "/web/my/channel",
  "/videos",
  "/images",
] as const;

export function isAuthOnlyPublicPath(pathname: string) {
  return (PUBLIC_AUTH_PATHS as readonly string[]).includes(pathname);
}

export function isPublicPath(pathname: string) {
  if (isAuthOnlyPublicPath(pathname)) return true;
  if (pathname === "/") return true;
  return PUBLIC_CONTENT_PREFIXES.some(
    (prefix) => prefix !== "/" && (pathname === prefix || pathname.startsWith(`${prefix}/`)),
  );
}

/** @deprecated Prefer isPublicPath / isAuthOnlyPublicPath */
export function isPublicAuthPath(pathname: string) {
  return isPublicPath(pathname);
}
