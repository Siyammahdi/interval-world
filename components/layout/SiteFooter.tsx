import Link from "next/link";
import { footerLinks } from "@/data/navigation";

/** Minimal Figma footer — copyright + legal links (social lives in Ask Expert). */
export function SiteFooter() {
  return (
    <footer className="w-full border-t border-iw-muted bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-4 px-6 pb-6 pt-[60px] text-center md:px-[120px]">
        <p className="text-[14px] font-bold tracking-[0.14px] text-iw-ink">
          Copyright© 2026 Interval International. All rights reserved.
        </p>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap items-center justify-center gap-x-0 gap-y-1 text-[12px] font-medium tracking-[0.12px] text-iw-ink">
            {footerLinks.map((link, index) => (
              <li key={link.label} className="flex items-center">
                {index > 0 && <span className="mx-1.5 text-iw-ink">|</span>}
                <Link href={link.href} className="hover:text-iw-link hover:underline">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
}
