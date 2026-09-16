import Image from "next/image";
import Link from "next/link";
import type { ParagraphPart, SidebarWidget, SitePage } from "@/data/pages";
import { defaultSidebar } from "@/data/pages";
import { Container } from "@/components/ui/Container";

type ContentPageProps = {
  page: SitePage;
};

function Paragraph({ parts }: { parts: ParagraphPart[] }) {
  return (
    <p className="mb-[1.35em] w-[95%] text-left text-[12px] leading-[18px] text-iw-navy">
      {parts.map((part, index) => {
        if (typeof part === "string") {
          return <span key={index}>{part}</span>;
        }
        return (
          <Link key={index} href={part.href} className="text-iw-blue hover:underline">
            {part.text}
          </Link>
        );
      })}
    </p>
  );
}

function toParts(paragraph: SitePage["paragraphs"][number]): ParagraphPart[] {
  if (typeof paragraph === "string") return [paragraph];
  return paragraph;
}

function SidebarBlock({ widget }: { widget: SidebarWidget }) {
  return (
    <div className="mb-[30px] block">
      <h4 className="m-0 bg-iw-blue px-[14px] py-2 text-[12px] font-normal leading-normal text-white">
        <Link href={widget.href} className="text-white hover:underline">
          {widget.title}
        </Link>
      </h4>
      <Link href={widget.href} className="block leading-none">
        <Image
          src={widget.image}
          alt={widget.imageAlt ?? ""}
          width={289}
          height={147}
          className="mb-2.5 h-auto w-full max-w-[289px] object-cover"
        />
      </Link>
    </div>
  );
}

/** Shared 2-column marketing layout (#p101_2col) used by most inner pages */
export function ContentPage({ page }: ContentPageProps) {
  const heroImage = page.heroImage ?? "/images/pages/ownership-hero.jpg";
  const showPlay = page.showPlay ?? true;
  const sidebar = page.sidebar ?? defaultSidebar;
  const heading = page.heading ?? page.title;

  return (
    <main id="main-content" className="pb-8 pt-4">
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-0">
          {/* Left column — 610px */}
          <article className="w-full lg:w-[610px] lg:shrink-0">
            <div
              className="relative h-[230px] w-full max-w-[610px] cursor-pointer overflow-hidden"
              role="img"
              aria-label={page.heroAlt ?? page.title}
            >
              <Image
                src={heroImage}
                alt={page.heroAlt ?? ""}
                width={610}
                height={231}
                priority
                className="h-full w-full object-cover"
              />
              {showPlay && (
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[url('/images/ui/btn_play_120.png')] bg-center bg-no-repeat"
                />
              )}
            </div>

            <h2 className="ml-5 mt-[25px] mb-[16px] text-[20px] font-normal leading-[30px] text-iw-navy">
              {heading}
            </h2>

            <div className="ml-5 mr-5">
              {page.paragraphs.map((paragraph, index) => (
                <Paragraph key={index} parts={toParts(paragraph)} />
              ))}
            </div>
          </article>

          {/* Right column — ~290px content + left rule */}
          <aside className="w-full border-[#e6ecf0] lg:ml-2.5 lg:w-[310px] lg:shrink-0 lg:border-l lg:pl-5">
            {sidebar.map((widget) => (
              <SidebarBlock key={widget.title + widget.href} widget={widget} />
            ))}
          </aside>
        </div>
      </Container>
    </main>
  );
}
