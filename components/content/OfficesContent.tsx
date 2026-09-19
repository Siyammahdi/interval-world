"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { rewriteLiveHtmlLinks } from "@/lib/rewrite-live-links";

type OfficesContentProps = {
  html: string;
};

/**
 * Our Offices — Figma Contact us (node 33:1999)
 * Keeps live office tables + country jump menu, restyled to Figma.
 */
export function OfficesContent({ html }: OfficesContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const bodyHtml = useMemo(() => rewriteLiveHtmlLinks(html), [html]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    // Hide legacy h1 — we render the Figma title above
    root.querySelectorAll("h1").forEach((el) => {
      (el as HTMLElement).style.display = "none";
    });

    // Soften bold intro that we also render above
    const intro = root.querySelector("p strong");
    if (intro && intro.textContent?.includes("local Interval servicing office")) {
      const wrap = intro.closest("p");
      if (wrap) (wrap as HTMLElement).style.display = "none";
      const parentP = wrap?.parentElement;
      if (parentP?.tagName === "P") parentP.style.display = "none";
    }

    const select = root.querySelector<HTMLSelectElement>('select[name="select2"], select');
    if (!select) {
      setReady(true);
      return;
    }

    // Style label row: "Country of Residency:"
    const form = select.closest("form");
    if (form) {
      form.classList.add("iw-offices-country-form");
      // Normalize adjacent text node label
      Array.from(form.childNodes).forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.includes("Country")) {
          const span = document.createElement("span");
          span.className = "iw-offices-country-label";
          span.textContent = "Country of Residency:";
          form.insertBefore(span, node);
          node.textContent = "";
        }
        if (node.nodeType === Node.ELEMENT_NODE) {
          const el = node as HTMLElement;
          if (el.tagName === "STRONG" && el.textContent?.toLowerCase().includes("country")) {
            el.replaceWith(
              Object.assign(document.createElement("span"), {
                className: "iw-offices-country-label",
                textContent: "Country of Residency:",
              }),
            );
          }
        }
      });
    }

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
    setReady(true);

    return () => select.removeEventListener("change", onChange);
  }, [bodyHtml]);

  return (
    <div className="iw-offices-figma w-full max-w-[827px]">
      <div className="mb-8">
        <h2 className="m-0 text-[35px] font-medium leading-[1.3] text-iw-link">Our Offices</h2>
        <p className="mt-2 text-[14px] leading-[1.7] text-iw-ink">
          To find your local Interval servicing office, please select your country of residency from
          the drop down below.
        </p>
      </div>
      <div
        ref={ref}
        className={`iw-offices-content${ready ? " iw-offices-content--ready" : ""}`}
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
    </div>
  );
}
