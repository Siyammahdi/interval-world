/** Temporary demo gate — replace with real auth later. */
export const DEMO_USERNAME = "Ann";
export const DEMO_PASSWORD = "Foysal";
export const AUTH_COOKIE = "iw_demo_session";
export const AUTH_COOKIE_VALUE = "ann-authenticated";

/** Login / signup pages — logged-in users are redirected away from these. */
export const PUBLIC_AUTH_PATHS = [
  "/web/my/auth/loginPage",
  "/web/my/account/createProfileOrJoin",
  "/web/my/account/forgotSignInInfo",
] as const;

/** Marketing / directory pages anyone can open (logged in or not). */
const PUBLIC_CONTENT_PREFIXES = [
  "/resort-directory",
  "/resort-page",
  "/single-resort-page",
  "/available-unit",
  "/checkout",
] as const;

export function isAuthOnlyPublicPath(pathname: string) {
  return (PUBLIC_AUTH_PATHS as readonly string[]).includes(pathname);
}

export function isPublicPath(pathname: string) {
  if (isAuthOnlyPublicPath(pathname)) return true;
  return PUBLIC_CONTENT_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

/** @deprecated Prefer isPublicPath / isAuthOnlyPublicPath */
export function isPublicAuthPath(pathname: string) {
  return isPublicPath(pathname);
}

export function credentialsMatch(username: string, password: string) {
  return username.trim() === DEMO_USERNAME && password === DEMO_PASSWORD;
}
