import Image from "next/image";
import Link from "next/link";
import { AskExpert } from "@/components/home/AskExpert";

type Props = {
  title: string;
  children: React.ReactNode;
};

/** Figma chrome for live-extracted marketing pages (title, breadcrumbs, Ask Expert). */
export function MarketingLiveShell({ title, children }: Props) {
  return (
    <main id="main-content">
      <div className="mx-auto w-full max-w-[1440px] px-4 pb-12 pt-8 md:px-[120px] md:pb-[50px] md:pt-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-[28px] font-medium leading-[1.3] text-iw-navy md:text-[35px]">{title}</h1>
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
            <span className="text-iw-ink">{title}</span>
          </nav>
        </div>
        <div className="iw-live-body iw-live-body--figma clearfix">{children}</div>
      </div>
      <AskExpert />
    </main>
  );
}
