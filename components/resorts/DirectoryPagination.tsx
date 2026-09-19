import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
};

function hrefFor(basePath: string, page: number, searchParams?: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  if (searchParams) {
    for (const [key, value] of Object.entries(searchParams)) {
      if (value && key !== "page") params.set(key, value);
    }
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

/** Figma directory pagination */
export function DirectoryPagination({ currentPage, totalPages, basePath, searchParams }: Props) {
  if (totalPages <= 1) return null;

  const windowStart = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => windowStart + i).filter(
    (p) => p >= 1 && p <= totalPages,
  );

  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-2">
      {currentPage > 1 ? (
        <Link
          href={hrefFor(basePath, currentPage - 1, searchParams)}
          className="rounded border border-iw-border bg-white px-3 py-2 text-[17px] text-iw-ink hover:bg-iw-surface"
        >
          &lt; Back
        </Link>
      ) : (
        <span className="rounded border border-iw-border bg-iw-surface px-3 py-2 text-[17px] text-iw-muted">
          &lt; Back
        </span>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={hrefFor(basePath, page, searchParams)}
          aria-current={page === currentPage ? "page" : undefined}
          className={cn(
            "flex size-10 items-center justify-center rounded text-[17px]",
            page === currentPage
              ? "bg-iw-navy text-white"
              : "border border-iw-border bg-white text-iw-ink hover:bg-iw-surface",
          )}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages ? (
        <Link
          href={hrefFor(basePath, currentPage + 1, searchParams)}
          className="rounded border border-iw-border bg-white px-3 py-2 text-[17px] text-iw-ink hover:bg-iw-surface"
        >
          Next &gt;
        </Link>
      ) : (
        <span className="rounded border border-iw-border bg-iw-surface px-3 py-2 text-[17px] text-iw-muted">
          Next &gt;
        </span>
      )}
    </nav>
  );
}
