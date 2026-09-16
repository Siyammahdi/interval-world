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

/** Homepage hero carousel — mirrors live Interval Nivo slides */
export const heroSlides: HeroSlide[] = [
  {
    id: "exchange-special",
    href: "/web/my/deals",
    alt: "Exchange Special: Exchange & Receive a resort accomodations certificate",
    image: "/images/slider/slide1.jpg",
  },
  {
    id: "transparency",
    href: "/web/my/info/benefits/getaways",
    alt: "Total price. Total transparency. Vacation planning is easier than ever with up-front pricing.",
    image: "/images/slider/slide2.jpg",
  },
  {
    id: "getaways",
    href: "/web/my/info/benefits/getaways",
    alt: "Your next Getaway is here! Resort vacations without exchanging! Explore Getaways",
    image: "/images/slider/slide3.jpg",
  },
  {
    id: "travel-articles",
    href: "https://pub.intervalworld.com/interval50th/",
    alt: "Spark your next great adventure with our travel articles. Get vacation ideas, destination guides and more.",
    image: "/images/slider/slide4.jpg",
  },
  {
    id: "deposit",
    href: "/web/cs/deposit",
    alt: "Deposit for the Ultimate Flexibility",
    image: "/images/slider/slide5.jpg",
  },
  {
    id: "eplus",
    href: "/web/cs/eplus",
    alt: "E-Plus - Flex More Exchange Muscle. Change destinations. Change resorts. Change travel dates.",
    image: "/images/slider/slide6.jpg",
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
    image: "/images/features/ownership.jpg",
    imageAlt: "Vacation Ownership",
  },
  {
    id: "exchange",
    title: "Exchange",
    description:
      "See more, and do more, beyond your home resort network and during different times of the year. Interval gives you many tools to help you make the exchange you want, when you want it!",
    href: "/web/my/info/benefits/exchange",
    image: "/images/features/exchange.jpg",
    imageAlt: "Exchange",
  },
  {
    id: "getaways",
    title: "Getaways",
    description:
      "Why book a cramped hotel room when you can stay in a spacious resort for less money? Since Getaways are priced so right, you can travel more often!",
    href: "/web/my/info/benefits/getaways",
    image: "/images/features/getaways.jpg",
    imageAlt: "Getaways",
  },
  {
    id: "fifty",
    title: "50 years of looking forward.",
    description: "Head to our 50th celebration page for the stories and experiences that brought us here.",
    href: "https://pub.intervalworld.com/interval50th/",
    image: "/images/features/50years.jpg",
    imageAlt: "50 years of looking forward.",
  },
];

/** Destinations shown in 4 columns on the homepage — all open the directory for now */
export const destinations: Destination[] = [
  { label: "Aruba", href: "/web/cs/directory" },
  { label: "Orlando, Florida", href: "/web/cs/directory" },
  { label: "Palm Springs, California", href: "/web/cs/directory" },
  { label: "Paris, France", href: "/web/cs/directory" },
  { label: "Cancun, Mexico", href: "/web/cs/directory" },
  { label: "Williamsburg, Virginia", href: "/web/cs/directory" },
  { label: "Phoenix, Arizona", href: "/web/cs/directory" },
  { label: "Australia", href: "/web/cs/directory" },
  { label: "St. Maarten", href: "/web/cs/directory" },
  { label: "Poconos, Pennsylvania", href: "/web/cs/directory" },
  { label: "Hawaiian Islands", href: "/web/cs/directory" },
  { label: "Asia", href: "/web/cs/directory" },
  { label: "Puerto Vallarta, Mexico", href: "/web/cs/directory" },
  { label: "Las Vegas, Nevada", href: "/web/cs/directory" },
  { label: "Costa del Sol, Spain", href: "/web/cs/directory" },
  { label: "View All", href: "/web/cs/directory" },
];
