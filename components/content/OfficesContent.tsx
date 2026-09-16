"use client";

import { useEffect, useRef } from "react";
import { rewriteLiveHtmlLinks } from "@/lib/rewrite-live-links";

type OfficesContentProps = {
  html: string;
};

/**
 * Our Offices content with working country jump-menu (live MM_jumpMenu behavior).
 */
export function OfficesContent({ html }: OfficesContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const bodyHtml = rewriteLiveHtmlLinks(html);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const select = root.querySelector<HTMLSelectElement>('select[name="select2"], select');
    if (!select) return;

    const onChange = () => {
      const value = select.value?.trim();
      if (!value || value === "Select location here") return;
      const id = value.replace(/^#/, "");
      const target =
        root.querySelector(`#${CSS.escape(id)}`) ||
        root.querySelector(`a[name="${CSS.escape(id)}"]`) ||
        document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
        if (value.startsWith("#")) {
          history.replaceState(null, "", value);
        }
      }
    };

    select.addEventListener("change", onChange);
    select.removeAttribute("onchange");
    select.removeAttribute("onChange");

    return () => select.removeEventListener("change", onChange);
  }, [bodyHtml]);

  return (
    <div
      ref={ref}
      className="iw-offices-content"
      dangerouslySetInnerHTML={{ __html: bodyHtml }}
    />
  );
}
