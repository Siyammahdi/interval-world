"use client";

import { useEffect, useRef, useState } from "react";
import { languages } from "@/data/navigation";
import { cn } from "@/lib/cn";

/** Language control for the navy top utility bar */
export function LanguageSelect() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative flex items-center gap-1.5 text-[11px] text-white"
    >
      <span className="font-normal">Language:</span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "relative min-w-[88px] rounded-sm border border-white/40 bg-white py-0.5 pl-2 pr-5 text-left text-[11px] text-iw-navy",
          open && "rounded-b-none",
        )}
      >
        English
        <span
          aria-hidden
          className="pointer-events-none absolute right-1.5 top-1/2 h-0 w-0 -translate-y-1/2 border-x-[3.5px] border-t-[4px] border-x-transparent border-t-iw-navy"
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 min-w-[120px] overflow-hidden rounded-b border border-[#b8c0cc] border-t-0 bg-white shadow-md"
        >
          {languages
            .filter((lang) => lang.code !== "en")
            .map((lang) => (
              <li key={lang.code} role="option">
                <a
                  href={lang.href}
                  className="block px-3 py-1.5 text-[11px] text-iw-navy hover:bg-[#eef3f8] hover:text-iw-blue"
                  onClick={() => setOpen(false)}
                >
                  {lang.label}
                </a>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
