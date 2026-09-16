/**
 * Map legacy Interval CS query URLs onto local routes that have content.
 * Member-gated search URLs fall back to the closest marketing page.
 */
const CS_P_MAP: Record<string, string> = {
  about: "/web/cs/about",
  legal: "/web/cs/legal",
  "customer-service": "/web/cs/customer-service",
  "help-login": "/web/cs/help-login",
  "mobile-app": "/web/cs/mobile-app",
  offices: "/web/cs/offices",
  "travel-advisories": "/web/cs/travel-advisories",
  eplus: "/web/cs/eplus",
  deposit: "/web/cs/deposit",
  directory: "/web/cs/directory",
};

const S_MAP: Record<string, string> = {
  "gold-getaways": "/web/my/info/benefits/getaways",
  "platinum-getaways": "/web/my/info/benefits/getaways",
  "best-price-guarantee": "/web/my/info/benefits/getaways",
  "benefits-eplus": "/web/cs/eplus",
  "benefits-certificates": "/web/my/info/benefits/membership",
  "gold-concierge": "/web/my/info/benefits/gold",
  "gold-aspire-golf": "/web/my/info/benefits/gold",
  "platinum-aspire-golf": "/web/my/info/benefits/platinum",
  "gold-hertz": "/web/my/info/benefits/gold",
  "tr-home-content": "/web/my/info/planning",
};

function decodeNestedUrl(raw: string): string {
  let value = raw;
  for (let i = 0; i < 3; i++) {
    try {
      const next = decodeURIComponent(value);
      if (next === value) break;
      value = next;
    } catch {
      break;
    }
  }
  return value;
}

function mapFromSearchParams(params: URLSearchParams): string | null {
  const a = params.get("a");
  const p = params.get("p");
  const s = params.get("s");
  const url = params.get("url");

  if (a === "1500" || a === "1501") return "/web/cs/directory";
  if (a === "80") return "/web/cs/email-us";

  if (p && CS_P_MAP[p]) return CS_P_MAP[p];
  if (s) {
    const key = s.trim();
    if (S_MAP[key]) return S_MAP[key];
  }

  if (url) {
    const nested = decodeNestedUrl(url);
    // Nested may be absolute or path with its own query
    try {
      const nestedUrl = nested.startsWith("http")
        ? new URL(nested)
        : new URL(nested, "https://www.intervalworld.com");
      if (nestedUrl.pathname.startsWith("/web/") && !nestedUrl.search) {
        return nestedUrl.pathname;
      }
      const mapped = mapFromSearchParams(nestedUrl.searchParams);
      if (mapped) return mapped;
      if (CS_P_MAP[nestedUrl.searchParams.get("p") || ""]) {
        return CS_P_MAP[nestedUrl.searchParams.get("p")!];
      }
      const nestedS = nestedUrl.searchParams.get("s");
      if (nestedS && S_MAP[nestedS]) return S_MAP[nestedS];
    } catch {
      /* ignore */
    }
  }

  if (a === "60" && p) return CS_P_MAP[p] ?? null;
  if (a === "95" && url) {
    // Login gate — map nested target or fall back to login
    return mapFromSearchParams(new URLSearchParams(`url=${encodeURIComponent(url)}`))
      ?? "/web/my/auth/loginPage";
  }

  return null;
}

/** Resolve a /web/cs?... or absolute Interval CS URL to a local path. */
export function resolveCsHref(href: string): string | null {
  if (!href || href.startsWith("#") || href.startsWith("mailto:")) return null;

  let pathWithQuery = href;
  try {
    if (href.startsWith("http")) {
      const u = new URL(href);
      if (!/intervalworld\.com$/i.test(u.hostname) && u.hostname !== "www.intervalworld.com") {
        return null;
      }
      pathWithQuery = `${u.pathname}${u.search}`;
    }
  } catch {
    return null;
  }

  // Already a clean local path — remap known empty stubs
  if (pathWithQuery.startsWith("/web/") && !pathWithQuery.includes("?")) {
    if (pathWithQuery === "/web/my/info/benefits/eplus") return "/web/cs/eplus";
    if (pathWithQuery === "/web/my/info/benefits/intervalOptions") {
      return "/web/my/info/benefits/exchange";
    }
    return pathWithQuery;
  }

  if (!pathWithQuery.startsWith("/web/cs")) return null;

  const qIndex = pathWithQuery.indexOf("?");
  const query = qIndex >= 0 ? pathWithQuery.slice(qIndex + 1) : "";
  // Handle &amp; in HTML attributes
  const params = new URLSearchParams(query.replace(/&amp;/g, "&"));
  return mapFromSearchParams(params);
}

/** Rewrite hrefs inside extracted live HTML so in-app navigation works. */
export function rewriteLiveHtmlLinks(html: string): string {
  return html.replace(
    /\bhref=(["'])([^"']+)\1/gi,
    (full, quote: string, href: string) => {
      const mapped = resolveCsHref(href);
      if (!mapped || mapped === href) return full;
      return `href=${quote}${mapped}${quote}`;
    },
  );
}
