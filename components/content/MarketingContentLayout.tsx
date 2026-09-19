import Image from "next/image";
import Link from "next/link";

type Crumb = { label: string; href?: string };

type SideCard = {
  title: string;
  href: string;
  image: string;
};

type Props = {
  title: string;
  breadcrumbs: Crumb[];
  heroImage: string;
  heroAlt?: string;
  showPlay?: boolean;
  children: React.ReactNode;
  sideCards?: SideCard[];
};

export function MarketingContentLayout({
  title,
  breadcrumbs,
  heroImage,
  heroAlt = "",
  showPlay = true,
  children,
  sideCards = [],
}: Props) {
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-12 pt-8 md:px-[120px] md:pb-[50px] md:pt-8">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-[28px] font-medium leading-[1.3] text-iw-navy md:text-[35px]">{title}</h1>
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[12px] font-medium tracking-[0.12px]">
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

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-8">
          <div className="relative h-[220px] w-full overflow-hidden rounded-2xl md:h-[343px]">
            <Image src={heroImage} alt={heroAlt} fill className="object-cover" sizes="792px" priority />
            {showPlay ? (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <Image src="/images/figma/ownership/play.svg" alt="" width={80} height={80} />
              </div>
            ) : null}
          </div>
          <div className="text-iw-ink">{children}</div>
        </div>

        {sideCards.length > 0 ? (
          <aside className="flex w-full shrink-0 flex-col gap-6 lg:w-[384px]">
            {sideCards.map((card) => (
              <Link
                key={card.href + card.title}
                href={card.href}
                className="flex flex-col gap-4 rounded-2xl border border-iw-border bg-white p-4 shadow-[9px_16px_15px_rgba(161,161,161,0.2)] transition-shadow hover:shadow-lg"
              >
                <div className="relative h-[200px] w-full overflow-hidden rounded-lg">
                  <Image src={card.image} alt="" fill className="object-cover" sizes="352px" />
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="truncate text-[17px] font-medium text-iw-ink">{card.title}</p>
                  <Image
                    src="/images/figma/ownership/external.svg"
                    alt=""
                    width={28}
                    height={28}
                    className="size-7 shrink-0"
                  />
                </div>
              </Link>
            ))}
          </aside>
        ) : null}
      </div>
    </div>
  );
}
