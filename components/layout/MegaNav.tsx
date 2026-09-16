"use client";

import Link from "next/link";
import { useState } from "react";
import { mainNav, type NavItem } from "@/data/navigation";
import { cn } from "@/lib/cn";

function NavTab({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const hasChildren = item.children.length > 0;

  return (
    <li
      className="relative flex-1 border-r border-white/25 last:border-r-0"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
    >
      <Link
        href={item.href}
        className={cn(
          "flex h-[37px] items-center justify-center px-2 text-center text-[12px] font-bold leading-tight !text-white",
          "outline-none transition-colors",
          open ? "!bg-iw-navy !text-iw-navy" : "bg-transparent hover:bg-iw-nav/10",
        )}
        aria-haspopup={hasChildren}
        aria-expanded={hasChildren ? open : undefined}
      >
        {item.label}
      </Link>

      {hasChildren && open && (
        <ul className="absolute left-0 top-full z-40 min-w-[220px] border border-iw-navy border-t-0 bg-white py-1 shadow-lg">
          {item.children.map((child) => (
            <li key={child.href + child.label}>
              <Link
                href={child.href}
                className="block whitespace-nowrap px-3 py-1.5 text-[12px] font-normal text-iw-navy hover:bg-[#e8f1f8] hover:text-iw-blue"
              >
                {child.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

/** Primary mega-menu — navy bar, white labels, white hover panel (matches live sprites) */
export function MegaNav() {
  return (
    <nav aria-label="Primary" className="w-full bg-iw-navy text-white">
      <ul className="flex w-full list-none">
        {mainNav.map((item) => (
          <NavTab key={item.id} item={item} />
        ))}
      </ul>
    </nav>
  );
}
