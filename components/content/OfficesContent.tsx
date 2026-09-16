"use client";

import { useEffect, useRef } from "react";

type OfficesContentProps = {
  html: string;
};

/**
 * Our Offices content with working country jump-menu (live MM_jumpMenu behavior).
 */
export function OfficesContent({ html }: OfficesContentProps) {
  const ref = useRef<HTMLDivElement>(null);

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
        // Keep hash for deep-linking like the live site
        if (value.startsWith("#")) {
          history.replaceState(null, "", value);
        }
      }
    };

    select.addEventListener("change", onChange);
    // Strip inline onChange from live markup
    select.removeAttribute("onchange");
    select.removeAttribute("onChange");

    return () => select.removeEventListener("change", onChange);
  }, [html]);

  return (
    <div
      ref={ref}
      className="iw-offices-content"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
