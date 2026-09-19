"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { languages } from "@/data/navigation";

/** Language control matching Figma header (text + chevron). */
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
    <div ref={rootRef} className="relative flex items-center gap-2 text-[17px] text-iw-ink">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2"
      >
        English
        <Image
          src="/images/figma/home/chevron.svg"
          alt=""
          width={23}
          height={23}
          className="size-[23px] rotate-90"
          aria-hidden
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-full z-50 mt-2 min-w-[140px] overflow-hidden rounded-lg border border-iw-border bg-white shadow-md"
        >
          {languages
            .filter((lang) => lang.code !== "en")
            .map((lang) => (
              <li key={lang.code} role="option">
                <a
                  href={lang.href}
                  className="block px-3 py-2 text-[14px] text-iw-ink hover:bg-iw-surface hover:text-iw-blue"
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
