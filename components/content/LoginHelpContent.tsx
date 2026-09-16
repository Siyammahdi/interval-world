"use client";

import { useEffect, useRef, useState } from "react";
import { rewriteLiveHtmlLinks } from "@/lib/rewrite-live-links";

type LoginHelpContentProps = {
  html: string;
};

/**
 * Log In Help — expandable sections + demo continue forms (live forgotSignInInfo).
 */
export function LoginHelpContent({ html }: LoginHelpContentProps) {
  const ref = useRef<HTMLDivElement>(null);
  const bodyHtml = rewriteLiveHtmlLinks(html);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const triggers = Array.from(
      root.querySelectorAll<HTMLAnchorElement>("a.icon_expand, a[id^='collapse_trigger_']"),
    );

    const onToggle = (event: Event) => {
      event.preventDefault();
      const trigger = event.currentTarget as HTMLAnchorElement;
      const id = trigger.id.replace("collapse_trigger_", "collapse_");
      const panel = root.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
      if (!panel) return;
      const isHidden =
        panel.classList.contains("display_none") ||
        panel.style.display === "none" ||
        getComputedStyle(panel).display === "none";
      if (isHidden) {
        panel.classList.remove("display_none");
        panel.style.display = "block";
      } else {
        panel.classList.add("display_none");
        panel.style.display = "none";
      }
    };

    for (const trigger of triggers) {
      trigger.addEventListener("click", onToggle);
    }

    const forms = Array.from(root.querySelectorAll("form"));
    const onSubmit = (event: Event) => {
      event.preventDefault();
      setNotice(
        "This is a demo Contact Support form. Sign-in recovery is not connected to Interval systems yet.",
      );
    };
    for (const form of forms) {
      form.addEventListener("submit", onSubmit);
    }

    root.querySelectorAll<HTMLElement>("[id^='collapse_']").forEach((panel) => {
      panel.classList.add("display_none");
      panel.style.display = "none";
    });

    return () => {
      for (const trigger of triggers) trigger.removeEventListener("click", onToggle);
      for (const form of forms) form.removeEventListener("submit", onSubmit);
    };
  }, [bodyHtml]);

  return (
    <div className="iw-login-help">
      {notice ? (
        <p className="iw-login-help__notice" role="status">
          {notice}
        </p>
      ) : null}
      <div ref={ref} dangerouslySetInnerHTML={{ __html: bodyHtml }} />
    </div>
  );
}
