"use client";

import { useEffect, useMemo, useState } from "react";
import { rewriteLiveHtmlLinks } from "@/lib/rewrite-live-links";
import { cn } from "@/lib/cn";

type FaqContentProps = {
  html: string;
};

type FaqItem = {
  id: string;
  question: string;
  answerHtml: string;
};

type FaqCategory = {
  id: string;
  label: string;
  items: FaqItem[];
};

const CATEGORY_LABELS: Record<string, string> = {
  ii_app_faq: "Interval International To Go App FAQs",
  help_login: "Login, Profile and Password",
  ii_mobile_faq: "Mobile Web Site",
};

function decodeEntities(text: string) {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&rsquo;/gi, "’")
    .replace(/&#8217;/gi, "’")
    .replace(/&ldquo;/gi, "“")
    .replace(/&rdquo;/gi, "”")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;/gi, "'")
    .trim();
}

function stripTags(html: string) {
  return decodeEntities(html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function extractPanel(html: string, id: string) {
  const start = html.indexOf(`id="${id}"`);
  if (start < 0) return "";
  const from = html.indexOf(">", start) + 1;
  const markers = ["help_login", "ii_app_faq", "ii_mobile_faq"].filter((x) => x !== id);
  let end = html.length;
  for (const marker of markers) {
    const idx = html.indexOf(`id="${marker}"`, from);
    if (idx > from && idx < end) end = idx;
  }
  return html.slice(from, end);
}

function parseItems(panelHtml: string, categoryId: string): FaqItem[] {
  const items: FaqItem[] = [];
  const re =
    /<div[^>]*class="[^"]*CollapsiblePanel[^"]*"[^>]*>[\s\S]*?<div[^>]*class="[^"]*CollapsiblePanelTab[^"]*"[^>]*>[\s\S]*?<h2[^>]*>([\s\S]*?)<\/h2>[\s\S]*?<\/div>[\s\S]*?<div[^>]*class="[^"]*CollapsiblePanelContent[^"]*"[^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = re.exec(panelHtml))) {
    i += 1;
    items.push({
      id: `${categoryId}-${i}`,
      question: stripTags(match[1]),
      answerHtml: match[2]
        .replace(/<\/?ul[^>]*>/gi, "")
        .replace(/<\/?li[^>]*>/gi, "")
        .replace(/list-style-type:\s*upper-alpha;?/gi, "")
        .trim(),
    });
  }
  return items;
}

function parseCategories(html: string): FaqCategory[] {
  const order = ["ii_app_faq", "help_login", "ii_mobile_faq"];
  return order
    .map((id) => ({
      id,
      label: CATEGORY_LABELS[id] || id,
      items: parseItems(extractPanel(html, id), id),
    }))
    .filter((c) => c.items.length > 0);
}

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex h-3 w-3 shrink-0 text-iw-link transition-transform",
        open ? "rotate-90" : "rotate-0",
      )}
      aria-hidden
    >
      <svg viewBox="0 0 8 12" fill="none" className="h-full w-full">
        <path d="M1.5 1.5L6 6L1.5 10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </span>
  );
}

/**
 * Sign In FAQs — Figma Contact us (node 33:1882)
 */
export function FaqContent({ html }: FaqContentProps) {
  const bodyHtml = useMemo(() => rewriteLiveHtmlLinks(html), [html]);
  const categories = useMemo(() => parseCategories(bodyHtml), [bodyHtml]);
  const [categoryId, setCategoryId] = useState("ii_app_faq");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    const preferred =
      categories.find((c) => c.id === "ii_app_faq") ||
      categories.find((c) => c.id === "help_login") ||
      categories[0];
    if (preferred) {
      setCategoryId(preferred.id);
      setOpenId(preferred.items[0]?.id ?? null);
    }
  }, [categories]);

  const active = categories.find((c) => c.id === categoryId) || categories[0];

  if (!active) {
    return (
      <div
        className="iw-faq-content"
        dangerouslySetInnerHTML={{ __html: bodyHtml }}
      />
    );
  }

  return (
    <div className="iw-faq-content flex w-full max-w-[827px] flex-col gap-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="m-0 text-[14px] leading-[1.7] text-iw-navy">
          Please select your FAQs Category:
        </p>
        <label className="sr-only" htmlFor="faq-category">
          FAQ Category
        </label>
        <select
          id="faq-category"
          value={categoryId}
          onChange={(e) => {
            const next = e.target.value;
            setCategoryId(next);
            const cat = categories.find((c) => c.id === next);
            setOpenId(cat?.items[0]?.id ?? null);
          }}
          className="h-11 min-w-[260px] rounded-lg border border-iw-border bg-iw-ink px-4 text-[17px] font-medium text-white outline-none"
        >
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-4">
        {active.items.map((item) => {
          const open = openId === item.id;
          return (
            <section key={item.id} className="rounded border border-iw-border bg-white px-4 py-4">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 text-left"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : item.id)}
              >
                <span className="text-[20px] font-bold text-iw-link">{item.question}</span>
                <Chevron open={open} />
              </button>
              {open ? (
                <div
                  className="iw-faq-answer mt-2.5 space-y-3 text-[14px] leading-[1.7] text-iw-ink"
                  dangerouslySetInnerHTML={{ __html: item.answerHtml }}
                />
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}
