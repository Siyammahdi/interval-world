import Image from "next/image";
import Link from "next/link";
import { AskExpert } from "@/components/home/AskExpert";
import { cn } from "@/lib/cn";

export type CsNavItem = {
  label: string;
  href: string;
  match?: string | string[];
};

/** Figma Customer Support tabs (Email US → Our Offices) */
export const customerSupportNav: CsNavItem[] = [
  {
    label: "Email US",
    href: "/web/cs/email-us",
    match: ["/web/cs/email-us", "/web/cs/customer-service"],
  },
  {
    label: "Log In Help",
    href: "/web/my/account/forgotSignInInfo",
    match: "/web/my/account/forgotSignInInfo",
  },
  {
    label: "Sign In FAQs",
    href: "/web/cs/help-login",
    match: "/web/cs/help-login",
  },
  {
    label: "Our Offices",
    href: "/web/cs/offices",
    match: "/web/cs/offices",
  },
];

type CsSupportLayoutProps = {
  activePath: string;
  children: React.ReactNode;
};

function isActive(item: CsNavItem, activePath: string) {
  const matches = Array.isArray(item.match) ? item.match : [item.match || item.href];
  return matches.some((m) => activePath === m || activePath.startsWith(m + "/"));
}

/** Figma Customer Support shell — title, breadcrumbs, horizontal tabs */
export function CsSupportLayout({ activePath, children }: CsSupportLayoutProps) {
  return (
    <main id="main-content" className="bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 pb-12 pt-8 md:px-[120px] md:pb-[50px]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="m-0 text-[28px] font-medium leading-[1.3] text-iw-navy md:text-[35px]">
            Customer Support
          </h1>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-[12px] font-medium tracking-[0.12px]"
          >
            <Link href="/" className="text-iw-muted hover:text-iw-link">
              Home
            </Link>
            <Image
              src="/images/figma/ownership/chevron.svg"
              alt=""
              width={5}
              height={8}
              className="mx-0.5 h-2 w-auto"
              aria-hidden
            />
            <span className="text-iw-ink">Customer Support</span>
          </nav>
        </div>

        <div
          role="tablist"
          aria-label="Customer Support sections"
          className="flex flex-col gap-2 rounded-2xl bg-iw-surface p-2 sm:flex-row sm:items-center sm:gap-4"
        >
          {customerSupportNav.map((item) => {
            const active = isActive(item, activePath);
            return (
              <Link
                key={item.href}
                href={item.href}
                role="tab"
                aria-selected={active}
                className={cn(
                  "flex flex-1 items-center justify-center rounded-lg p-2.5 text-center text-[15px] font-medium transition-colors md:text-[17px]",
                  active
                    ? "bg-iw-link text-white"
                    : "bg-white text-iw-ink hover:bg-white/80",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        <div className="iw-cs-figma-content w-full text-iw-ink">{children}</div>
      </div>
      <AskExpert />
    </main>
  );
}
