"use client";

import { useEffect, useRef } from "react";
import { rewriteLiveHtmlLinks } from "@/lib/rewrite-live-links";

type FaqContentProps = {
  html: string;
};

/**
 * FAQs — wires live showFAQ category switching onto extracted markup.
 */
export function FaqContent({ html }: FaqContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const bodyHtml = rewriteLiveHtmlLinks(html);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const select = root.querySelector<HTMLSelectElement>("#jumpMenu, select[name='jumpMenu']");
    const button = root.querySelector<HTMLInputElement | HTMLButtonElement>(
      "input.button[value='View FAQ'], button.button",
    );
    const panels = Array.from(
      root.querySelectorAll<HTMLElement>("#help_login, #ii_app_faq, #ii_mobile_faq"),
    );

    if (!select || panels.length === 0) return;

    function show(id: string) {
      for (const panel of panels) {
        panel.style.display = panel.id === id ? "block" : "none";
      }
    }

    // Default: show Login FAQ (most common contact path)
    if (![...select.options].some((o) => o.value === select.value)) {
      select.value = "help_login";
    }
    show(select.value || "help_login");

    const onView = () => show(select.value);
    const onChange = () => show(select.value);

    button?.addEventListener("click", onView);
    select.addEventListener("change", onChange);
    // neutralize live inline handler
    if (button) {
      button.removeAttribute("onclick");
      button.removeAttribute("onClick");
    }

    return () => {
      button?.removeEventListener("click", onView);
      select.removeEventListener("change", onChange);
    };
  }, [bodyHtml]);

  return (
    <div
      ref={ref}
      className="iw-faq-content"
      dangerouslySetInnerHTML={{ __html: bodyHtml }}
    />
  );
}
