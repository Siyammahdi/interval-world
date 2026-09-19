export type HeroSlide = {
  id: string;
  href: string;
  alt: string;
  image: string;
};

export type BenefitCard = {
  id: string;
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
};

export type Destination = {
  label: string;
  href: string;
};

/** Homepage hero — Figma Home page primary slide */
export const heroSlides: HeroSlide[] = [
  {
    id: "transparency",
    href: "/web/my/info/benefits/getaways",
    alt: "Total price. Total transparency. Vacation planning is easier than even with up-front pricing.",
    image: "/images/figma/home/hero.jpg",
  },
];

export const memberAlert = {
  title: "Important Member Information",
  bodyBefore: "The safety and well-being of our members is our top priority. Please refer to our",
  linkLabel: "Travel Advisories",
  linkHref: "/web/cs/travel-advisories",
  bodyAfter:
    "page for information regarding resort closures. The page is updated frequently, so please review it before proceeding with your travel plans.",
};

export const benefitCards: BenefitCard[] = [
  {
    id: "ownership",
    title: "Vacation Ownership",
    description:
      "Vacation ownership makes it possible to enjoy life the way it’s supposed to be lived – and as an Interval International® member, you get even more from your vacations.",
    href: "/web/my/info/ownership/overview",
    image: "/images/figma/home/card-ownership.jpg",
    imageAlt: "Vacation Ownership",
  },
  {
    id: "exchange",
    title: "Exchange",
    description:
      "See more, and do more, beyond your home resort network and during different times of the year. Interval gives you many tools to help you make the exchange you want, when you want it!",
    href: "/web/my/info/benefits/exchange",
    image: "/images/figma/home/card-exchange.jpg",
    imageAlt: "Exchange",
  },
  {
    id: "getaways",
    title: "Getaways",
    description:
      "Why book a cramped hotel room when you can stay in a spacious resort for less money? Since Getaways are priced so right, you can travel more often!",
    href: "/web/my/info/benefits/getaways",
    image: "/images/figma/home/card-getaways.jpg",
    imageAlt: "Getaways",
  },
  {
    id: "fifty",
    title: "50 YEARS OF LOOKING FORWARD",
    description: "Head to our 50th celebration page for the stories and experiences that brought us here.",
    href: "https://pub.intervalworld.com/interval50th/",
    image: "/images/figma/home/card-50years.jpg",
    imageAlt: "50 years of looking forward.",
  },
];

/** Destinations shown in 4 columns on the homepage */
export const destinations: Destination[] = [
  { label: "Aruba", href: "/resort-page/Aruba" },
  { label: "Orlando, Florida", href: "/resort-directory" },
  { label: "Palm Springs, California", href: "/resort-directory" },
  { label: "Paris, France", href: "/resort-page/France" },
  { label: "Cancun, Mexico", href: "/resort-page/Mexico" },
  { label: "Williamsburg, Virginia", href: "/resort-directory" },
  { label: "Phoenix, Arizona", href: "/resort-directory" },
  { label: "Australia", href: "/resort-page/Australia" },
  { label: "St. Maarten", href: "/resort-page/Sint%20Maarten" },
  { label: "Poconos, Pennsylvania", href: "/resort-directory" },
  { label: "Hawaiian Islands", href: "/resort-directory" },
  { label: "Asia", href: "/resort-directory" },
  { label: "Puerto Vallarta, Mexico", href: "/resort-page/Mexico" },
  { label: "Las Vegas, Nevada", href: "/resort-directory" },
  { label: "Costa del Sol, Spain", href: "/resort-page/Spain" },
  { label: "View All", href: "/resort-directory" },
];
