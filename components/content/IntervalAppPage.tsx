import Image from "next/image";
import Link from "next/link";
import { AskExpert } from "@/components/home/AskExpert";

const FEATURES = [
  {
    title: "Exchange Like Never Before",
    body: "This is what we call a game changer. The Interval International app now features the ability to exchange from the palm of your hand.",
    image: "/images/figma/app/icon1.jpg",
  },
  {
    title: "Smarter Search",
    body: "We've made it easier to see your vacation options! Search for both exchanges and Getaways together, or search each separately.",
    image: "/images/figma/app/icon1.jpg",
  },
  {
    title: "Book Your Way",
    body: "Search first, then decide the best way to book your vacation. Exchange using any of your available weeks or points — the rest is up to you.",
    image: "/images/figma/app/icon2.jpg",
  },
  {
    title: "Multi-Destination Search",
    body: "Search up to six destinations at once for every month you're looking to travel.",
    image: "/images/figma/app/icon3.jpg",
  },
  {
    title: "Upcoming Vacations",
    body: "View your upcoming vacations all in one place with fast and easy access to your trip confirmation details. Share your reservation information with friends and family.",
    image: "/images/figma/app/icon4.jpg",
  },
  {
    title: "Secure Sign In",
    body: "Quick and secure sign in with the touch of a finger or even a glance. Available on devices that support fingerprint or facial recognition.",
    image: "/images/figma/app/icon5.jpg",
  },
] as const;

const OTHER_FEATURES = [
  "Purchase E-Plus®, Guest Certificates, and Trip Protection.",
  "Deposit with ease from the Ownership/Units screen.",
  "Extend deposits and Resort Accommodations Certificates.",
  "Search vacations from your Favorites and select multiple resorts when completing a Vacation Search.",
  "Search for vacations using an exchange request.",
  "Apply for the Interval World Mastercard®.",
  "Search multiple resorts within a single destination",
  "Use the enhanced map to view resorts in an area",
  "See featured Flexchange destinations",
  "Access our Top 10 Getaways",
  "Create custom Getaway Alerts for seven-night stays",
  "Read our premier travel publication, Interval World® magazine",
  "Browse the Resort Directory",
  "Watch Interval HD videos",
  "Save a list of your favorite resorts",
  "Share resort information with friends via text message, email, Facebook, Twitter, or Pinterest",
];

function DownloadButtons({ dark = false }: { dark?: boolean }) {
  const cls = dark
    ? "bg-iw-ink text-white hover:bg-black"
    : "bg-iw-blue text-white hover:bg-iw-navy";
  return (
    <div className="flex flex-wrap gap-4">
      <a
        href="https://apps.apple.com/"
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-4 rounded-lg px-4 py-3 text-[17px] font-medium transition-colors ${cls}`}
      >
        Download for Apple ios
        <Image src="/images/figma/app/apple.svg" alt="" width={24} height={24} />
      </a>
      <a
        href="https://play.google.com/"
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-4 rounded-lg px-4 py-3 text-[17px] font-medium transition-colors ${cls}`}
      >
        Download for Android
        <Image src="/images/figma/app/android.svg" alt="" width={24} height={24} />
      </a>
    </div>
  );
}

export function IntervalAppPage() {
  return (
    <main id="main-content">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 pb-12 pt-8 md:px-[120px] md:pb-[50px]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-[28px] font-medium leading-[1.3] text-iw-navy md:text-[35px]">
            Interval International app
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
            <span className="text-iw-ink">Interval International App</span>
          </nav>
        </div>

        <div className="relative h-[280px] w-full overflow-hidden rounded-2xl md:h-[447px]">
          <Image
            src="/images/figma/app/hero.jpg"
            alt="Interval International app on mobile devices"
            fill
            priority
            className="object-cover"
            sizes="1200px"
          />
          <div className="absolute inset-x-0 bottom-6 flex justify-start px-6 md:px-10">
            <DownloadButtons />
          </div>
        </div>

        <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <article key={feature.title + feature.body.slice(0, 24)} className="flex flex-col items-center gap-4 text-center">
              <div className="relative size-40 overflow-hidden rounded-full">
                <Image src={feature.image} alt="" fill className="object-cover" sizes="160px" />
              </div>
              <div className="space-y-1">
                <h2 className="text-[22px] font-medium text-iw-ink md:text-[24px]">{feature.title}</h2>
                <p className="text-[14px] leading-[1.7] text-iw-ink">{feature.body}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="flex flex-col items-center gap-10 py-10 lg:flex-row lg:items-start lg:justify-center lg:gap-[93px]">
          <div className="relative h-[480px] w-[240px] shrink-0 md:h-[560px] md:w-[280px]">
            <Image
              src="/images/figma/app/phone.jpg"
              alt="Interval app phone mockup"
              fill
              className="object-contain"
              sizes="280px"
            />
          </div>
          <div className="max-w-[521px]">
            <h2 className="mb-4 text-[32px] font-medium tracking-[-0.32px] text-iw-ink md:text-[42px] md:tracking-[-0.42px]">
              Other Features
            </h2>
            <ul className="list-disc space-y-2 pl-6 text-[16px] leading-normal text-iw-ink md:text-[20px]">
              {OTHER_FEATURES.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 px-4 py-12 text-center md:px-20">
          <p className="max-w-[1009px] text-[28px] font-medium leading-[1.3] tracking-[-0.28px] text-iw-ink md:text-[42px] md:tracking-[-0.42px]">
            Mobile app is available for Apple and Android devices. Once you download the new Interval
            International app, please delete the older version of the app from your device.
          </p>
          <DownloadButtons dark />
        </div>
      </div>
      <AskExpert />
    </main>
  );
}
