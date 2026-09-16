import { redirect } from "next/navigation";
import { resolveCsHref } from "@/lib/rewrite-live-links";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

/**
 * Legacy Interval CS entrypoint: /web/cs?a=…&p=…&s=…&url=…
 * Redirects to the local page that holds the matching marketing content.
 */
export default async function CsQueryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    const v = first(value);
    if (v != null && v !== "") query.set(key, v);
  }

  const href = `/web/cs?${query.toString()}`;
  const mapped = resolveCsHref(href) ?? "/web/my/info/benefits";
  redirect(mapped);
}
