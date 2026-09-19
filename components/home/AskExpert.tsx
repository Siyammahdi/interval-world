import Image from "next/image";
import Link from "next/link";
import { socialLinks } from "@/data/navigation";

const FIGMA_SOCIAL: Record<string, string> = {
  Facebook: "/images/figma/home/social-fb.png",
  Instagram: "/images/figma/home/social-ig.png",
  Youtube: "/images/figma/home/social-yt.png",
  Pinterest: "/images/figma/home/social-pin.png",
};

export function AskExpert() {
  return (
    <section className="w-full border-t border-iw-muted bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-12 px-6 py-[60px] md:flex-row md:justify-between md:gap-[71px] md:px-[120px] md:py-[100px]">
        <div className="flex w-full max-w-[521px] flex-col gap-8 md:gap-[71px]">
          <div className="flex flex-col gap-8">
            <div>
              <h2 className="text-[32px] font-medium leading-[1.3] tracking-[-0.42px] text-iw-ink md:text-[42px]">
                Ask an Expert Online 24/7
              </h2>
              <p className="mt-2 text-[18px] font-normal text-iw-ink md:text-[20px]">
                Connect One-on-One with an Expert and Get Your Answer in Minutes, 24/7.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {socialLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="relative size-9 overflow-hidden rounded-full transition-opacity hover:opacity-80"
                >
                  <Image
                    src={FIGMA_SOCIAL[item.label] || item.icon}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="36px"
                  />
                </Link>
              ))}
            </div>
          </div>
          <Link
            href="/web/cs/email-us"
            className="inline-flex w-full max-w-[284px] items-center justify-center rounded-lg bg-iw-blue px-[42px] py-3 text-[17px] font-medium text-white transition-colors hover:bg-iw-blue-dark"
          >
            Let&apos;s Contact
          </Link>
        </div>

        <div className="relative h-[260px] w-full max-w-[588px] overflow-hidden rounded-2xl md:h-[314px]">
          <Image
            src="/images/figma/home/expert.jpg"
            alt="Ask an Interval expert"
            fill
            className="object-cover"
            sizes="588px"
          />
        </div>
      </div>
    </section>
  );
}
