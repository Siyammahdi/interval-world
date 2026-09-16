/** Temporary demo gate — replace with real auth later. */
export const DEMO_USERNAME = "Ann";
export const DEMO_PASSWORD = "Foysal";
export const AUTH_COOKIE = "iw_demo_session";
export const AUTH_COOKIE_VALUE = "ann-authenticated";

export const PUBLIC_AUTH_PATHS = [
  "/web/my/auth/loginPage",
  "/web/my/account/createProfileOrJoin",
  "/web/my/account/forgotSignInInfo",
] as const;

export function isPublicAuthPath(pathname: string) {
  return (PUBLIC_AUTH_PATHS as readonly string[]).includes(pathname);
}

export function credentialsMatch(username: string, password: string) {
  return username.trim() === DEMO_USERNAME && password === DEMO_PASSWORD;
}
