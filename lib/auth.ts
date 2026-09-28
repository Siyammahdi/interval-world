/** Auth cookie set after a successful demo login. */
export const AUTH_COOKIE = "iw_session";

/** Demo credentials (no backend). Override with env vars on the host if needed. */
export const DEMO_LOGIN_ID = process.env.DEMO_LOGIN_ID || "Ann";
export const DEMO_PASSWORD = process.env.DEMO_PASSWORD || "Foysal";

/** Cookie value that marks a signed-in visitor. */
export const AUTH_TOKEN = process.env.AUTH_TOKEN || "iw-demo-session-v1";

export const LOGIN_PATH = "/web/my/auth/loginPage";

/** Screens guests can open; signed-in users are redirected away from them. */
export const PUBLIC_AUTH_PATHS = [
  LOGIN_PATH,
  "/web/my/account/createProfileOrJoin",
  "/web/my/account/forgotSignInInfo",
] as const;

export function isAuthOnlyPublicPath(pathname: string) {
  return (PUBLIC_AUTH_PATHS as readonly string[]).includes(pathname);
}

/** Everything else on the site requires the demo login. */
export function isPublicPath(pathname: string) {
  return isAuthOnlyPublicPath(pathname);
}

export function isValidSession(value: string | undefined | null) {
  return value === AUTH_TOKEN;
}

export function isValidLogin(loginId: string, password: string) {
  return loginId === DEMO_LOGIN_ID && password === DEMO_PASSWORD;
}
