"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";

const BARE_PATHS = ["/web/my/auth/loginPage"];

function isBareChrome(pathname: string | null) {
  if (!pathname) return false;
  return BARE_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Conditionally wraps pages with site chrome.
 * Header/footer/banner are passed as server-rendered slots so they can use
 * `next/headers` — login routes render children only (no header/footer).
 */
export function AppShell({
  header,
  footer,
  banner,
  children,
}: {
  header: ReactNode;
  footer: ReactNode;
  banner: ReactNode;
  children: ReactNode;
}) {
  const pathname = usePathname();

  if (isBareChrome(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      {header}
      {children}
      {footer}
      {banner}
    </>
  );
}
