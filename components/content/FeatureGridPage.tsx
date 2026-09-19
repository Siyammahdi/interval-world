import Image from "next/image";
import Link from "next/link";
import { AskExpert } from "@/components/home/AskExpert";

type FeatureCard = {
  title: string;
  body: React.ReactNode;
  image: string;
  detailHref?: string;
};

type Crumb = { label: string; href?: string };

type Props = {
  title: string;
  breadcrumbs: Crumb[];
  heroImage: string;
  heroAlt?: string;
  showPlay?: boolean;
  cards: FeatureCard[];
  showViewDetails?: boolean;
  heroCta?: { label: string; href: string };
};

export function FeatureGridPage({
  title,
  breadcrumbs,
  heroImage,
  heroAlt = "",
  showPlay = true,
  cards,
  showViewDetails = false,
  heroCta,
}: Props) {
  return (
    <main id="main-content">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 pb-12 pt-8 md:px-[120px] md:pb-[50px]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-[28px] font-medium leading-[1.3] text-iw-navy md:text-[35px]">
            {title}
          </h1>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-[12px] font-medium tracking-[0.12px]"
          >
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.label + i} className="flex items-center gap-1">
                {i > 0 ? (
                  <Image
                    src="/images/figma/ownership/chevron.svg"
                    alt=""
                    width={5}
                    height={8}
                    className="mx-0.5 h-2 w-auto"
                    aria-hidden
                  />
                ) : null}
                {crumb.href ? (
                  <Link href={crumb.href} className="text-iw-muted hover:text-iw-link">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-iw-ink">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        </div>

        <div className="relative h-[220px] w-full overflow-hidden rounded-3xl md:h-[378px]">
          <Image
            src={heroImage}
            alt={heroAlt}
            fill
            priority
            className="object-cover"
            sizes="1200px"
          />
          {showPlay ? (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <Image src="/images/figma/ownership/play.svg" alt="" width={80} height={80} />
            </div>
          ) : null}
          {heroCta ? (
            <div className="absolute bottom-8 left-6 md:bottom-[72px] md:left-14">
              <Link
                href={heroCta.href}
                className="inline-flex w-[236px] items-center justify-center rounded-lg bg-iw-blue px-[42px] py-3 text-[17px] font-medium text-white transition-colors hover:bg-iw-navy"
              >
                {heroCta.label}
              </Link>
            </div>
          ) : null}
        </div>

        <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <article key={card.title} className="flex flex-col gap-4">
              <div className="relative h-[180px] w-full overflow-hidden rounded-lg md:h-[220px]">
                <Image src={card.image} alt="" fill className="object-cover" sizes="384px" />
              </div>
              <div className="space-y-1">
                <h2 className="text-[22px] font-medium text-iw-ink md:text-[24px]">{card.title}</h2>
                <div className="text-[14px] leading-[1.7] text-iw-ink">{card.body}</div>
              </div>
              {showViewDetails ? (
                <Link
                  href={card.detailHref || "#"}
                  className="text-[17px] font-bold text-iw-link underline"
                >
                  View Details
                </Link>
              ) : null}
            </article>
          ))}
        </div>
      </div>
      <AskExpert />
    </main>
  );
}
