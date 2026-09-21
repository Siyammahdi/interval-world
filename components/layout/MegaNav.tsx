"use client";

import Link from "next/link";
import type { NavItem } from "@/lib/cms";
import { cn } from "@/lib/cn";

function NavTab({ item }: { item: NavItem }) {
  const hasChildren = item.children.length > 0;

  return (
    <li className="group relative">
      <Link
        href={item.href}
        className={cn(
          "flex h-[42px] min-w-[140px] items-center justify-center border-r border-white px-2.5 text-center text-[14px] font-medium leading-tight text-white transition-colors md:min-w-[180px] md:text-[15px] lg:min-w-[220px] lg:text-[17px] xl:w-[260px]",
          "outline-none hover:bg-white/10 focus-visible:bg-white/10 group-hover:bg-white/10 group-focus-within:bg-white/10",
          item.id === "join" && "border-r-0",
        )}
        aria-haspopup={hasChildren || undefined}
      >
        {item.label}
      </Link>

      {hasChildren ? (
        <ul
          className={cn(
            "invisible absolute left-0 top-full z-[100] min-w-[260px] rounded-b-lg border border-iw-border bg-white py-1 opacity-0 shadow-[0_12px_24px_rgba(16,16,16,0.16)] transition-opacity",
            "pointer-events-none group-hover:visible group-hover:pointer-events-auto group-hover:opacity-100",
            "group-focus-within:visible group-focus-within:pointer-events-auto group-focus-within:opacity-100",
          )}
        >
          {item.children.map((child) => (
            <li key={child.href + child.label}>
              <Link
                href={child.href}
                className="block whitespace-nowrap px-4 py-2.5 text-[14px] font-medium text-iw-ink hover:bg-iw-surface hover:text-iw-blue"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

/** Full-width primary nav — Figma Color-09 navy bar */
export function MegaNav({ items }: { items: NavItem[] }) {
  return (
    <nav aria-label="Primary" className="relative z-50 w-full overflow-visible bg-iw-navy text-white">
      <div className="mx-auto w-full max-w-[1440px] overflow-visible">
        <ul className="flex w-full list-none items-center justify-start gap-0 overflow-visible px-2 py-1.5 md:justify-center md:px-8 lg:px-[116px]">
          {items.map((item) => (
            <NavTab key={item.id} item={item} />
          ))}
        </ul>
      </div>
    </nav>
  );
}
