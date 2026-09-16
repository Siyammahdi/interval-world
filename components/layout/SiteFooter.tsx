import Image from "next/image";
import Link from "next/link";
import { footerLinks, socialLinks } from "@/data/navigation";
import { Container } from "@/components/ui/Container";

export function SiteFooter() {
  return (
    <footer className="mt-2 w-full pb-6">
      <Container>
        {/* Social row */}
        <div className="mb-5 flex items-center justify-center gap-3 py-2">
          <span className="hidden h-px flex-1 max-w-[200px] bg-[#c5ced8] sm:block" aria-hidden />
          <div className="flex items-center gap-2">
            {socialLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={item.label}
                className="transition-opacity hover:opacity-80"
              >
                <Image src={item.icon} alt="" width={38} height={38} className="h-[38px] w-[38px] rounded-full" />
              </Link>
            ))}
          </div>
          <span className="hidden h-px flex-1 max-w-[200px] bg-[#c5ced8] sm:block" aria-hidden />
        </div>

        {/* App + ad row */}
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <Link href="/web/cs/mobile-app" className="shrink-0">
            <Image
              src="/images/misc/mobile_app.jpg"
              alt="Take your benefits with you. Discover our App"
              width={200}
              height={90}
              className="h-auto w-[200px]"
            />
          </Link>
          <div
            className="flex h-[90px] w-full max-w-[728px] flex-1 items-center justify-center border border-[#d0d7e0] bg-[#f4f6f8] text-[11px] text-[#8a94a3]"
            aria-label="Advertisement"
          >
            Advertisement
          </div>
        </div>

        <div className="border-t border-[#d0d7e0] pt-3">
          <div className="flex flex-col gap-2 text-[9px] text-[#5a6575] sm:flex-row sm:items-start sm:justify-between">
            <p className="shrink-0">
              Copyright© {new Date().getFullYear()} Interval International. All rights reserved.
            </p>
            <nav aria-label="Footer">
              <ul className="flex flex-wrap gap-x-0 gap-y-1 sm:justify-end">
                {footerLinks.map((link, index) => (
                  <li key={link.label} className="flex items-center">
                    {index > 0 && <span className="mx-1.5 text-[#9aa5b4]">|</span>}
                    <Link href={link.href} className="hover:text-iw-blue hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </Container>
    </footer>
  );
}
