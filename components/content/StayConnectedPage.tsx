import Image from "next/image";
import Link from "next/link";
import { AskExpert } from "@/components/home/AskExpert";
import { MarketingContentLayout } from "@/components/content/MarketingContentLayout";

const SIDE_CARDS = [
  {
    title: "Interval Internation App",
    href: "/web/cs/mobile-app",
    image: "/images/figma/community/card-app.jpg",
  },
  {
    title: "Interval World Magazine",
    href: "/web/my/info/planning/magazine",
    image: "/images/figma/community/card-magazine.jpg",
  },
  {
    title: "Like us on facebook",
    href: "https://www.facebook.com/IntervalInternational",
    image: "/images/figma/community/card-facebook.jpg",
  },
];

const SOCIAL = [
  { src: "/images/figma/home/social-fb.png", alt: "Facebook", href: "https://www.facebook.com/IntervalInternational" },
  { src: "/images/figma/home/social-ig.png", alt: "Instagram", href: "https://www.instagram.com/intervalinternational/" },
  { src: "/images/figma/home/social-yt.png", alt: "YouTube", href: "https://www.youtube.com/user/IntervalIntl" },
  { src: "/images/figma/home/social-pin.png", alt: "Pinterest", href: "https://www.pinterest.com/intervalintl/" },
] as const;

export function StayConnectedPage() {
  return (
    <main id="main-content">
      <MarketingContentLayout
        title="Stay Connected"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Stay Connected" }]}
        heroImage="/images/figma/community/hero.jpg"
        heroAlt="Couple reviewing a tablet on the beach"
        showPlay
        sideCards={SIDE_CARDS}
      >
        <h2 className="mb-8 text-[24px] font-medium text-iw-ink md:text-[29px]">
          Socialize with Us
        </h2>
        <div className="flex flex-col gap-8 text-[14px] leading-[1.7] text-iw-ink">
          <p>
            Whether you &apos;Like&apos; Facebook, share pictures on Instagram, post videos on
            YouTube or pin favorites on Pinterest, you can connect with Interval wherever you go.
            Add one — add them all! Let&apos;s be social together.
          </p>
          <div className="flex items-center gap-3">
            {SOCIAL.map((item) => (
              <Link
                key={item.alt}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative size-9 overflow-hidden rounded-full"
              >
                <Image src={item.src} alt={item.alt} fill className="object-cover" sizes="36px" />
              </Link>
            ))}
          </div>
          <p>
            Community is a members-only resource for all of your Interval- and travel-related
            questions. It&apos;s easy to get exchange and Getaway tips, travel recommendations, and
            resort details from your fellow Interval members. You can share your travel experiences
            — even your favorite vacation photos.
          </p>
          <Image
            src="/images/figma/community/profile.svg"
            alt=""
            width={32}
            height={32}
            className="size-8"
          />
          <p>
            <Link
              href="/web/my/account/createProfileOrJoin"
              className="font-medium text-iw-link underline"
            >
              Become a member of our community today
            </Link>{" "}
            and begin exploring!
          </p>
        </div>
      </MarketingContentLayout>
      <AskExpert />
    </main>
  );
}
