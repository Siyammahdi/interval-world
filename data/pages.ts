export type PageLink = {
  label: string;
  href: string;
};

export type TextLink = {
  text: string;
  href: string;
};

/** Plain string or mixed text + links for body copy */
export type ParagraphPart = string | TextLink;

export type SidebarWidget = {
  title: string;
  href: string;
  image: string;
  imageAlt?: string;
};

export type SitePage = {
  /** App path, e.g. /web/my/info/ownership */
  path: string;
  /** Browser tab / metadata title */
  title: string;
  /** H2 under the hero (defaults to title) */
  heading?: string;
  /** Optional eyebrow — kept for metadata helpers */
  eyebrow?: string;
  /** Short description for metadata */
  summary: string;
  /** Body paragraphs — string or rich parts with links */
  paragraphs: Array<string | ParagraphPart[]>;
  /** Left-column hero (610×231). Defaults to ownership beach hero. */
  heroImage?: string;
  heroAlt?: string;
  /** Centered play overlay on hero (default true) */
  showPlay?: boolean;
  /** Right-column promo widgets. Defaults to Join / Exchange / Benefits. */
  sidebar?: SidebarWidget[];
  /** @deprecated Prefer sidebar widgets — kept for backwards compatibility */
  related?: PageLink[];
  cta?: PageLink;
};

/** Standard right-rail widgets used on most pre-login info pages */
export const defaultSidebar: SidebarWidget[] = [
  {
    title: "Join Today",
    href: "/web/my/info/membership",
    image: "/images/sidebar/join-today.jpg",
    imageAlt: "Join Interval International today",
  },
  {
    title: "Learn About The Many Ways to Exchange!",
    href: "/web/my/info/benefits/exchange",
    image: "/images/sidebar/exchange.jpg",
    imageAlt: "Many ways to exchange",
  },
  {
    title: "Interval International Membership Benefits",
    href: "/web/my/info/benefits/membership",
    image: "/images/sidebar/benefits.jpg",
    imageAlt: "Membership benefits",
  },
];

/**
 * Demo content for every public marketing page.
 * Edit copy here — routes are generated from `path`.
 */
export const sitePages: SitePage[] = [
  // —— Ownership ——
  {
    path: "/web/my/info/ownership",
    title: "Why Vacation Ownership?",
    heading: "Great Vacations. Great Values.",
    eyebrow: "Vacation Ownership",
    summary:
      "Vacation ownership makes it possible to enjoy life the way it’s supposed to be lived — and as an Interval International® member, you get even more from your vacations.",
    heroImage: "/images/pages/ownership-hero.jpg",
    heroAlt: "Vacation ownership",
    showPlay: true,
    paragraphs: [
      [
        "More than 7 million people enjoy ",
        { text: "vacation ownership", href: "/web/my/info/ownership/overview" },
        " annually. As one of the most highly regulated products on the market, vacation ownership fits the lifestyle of families worldwide because it offers a variety of convenient, high-quality opportunities.",
      ],
      [
        "When you join ",
        { text: "Interval International", href: "/web/my/info/ownership/about" },
        "®, you receive even more from your vacations. Not only will you enjoy a great resort to retreat to every year, you can also decide to vacation in a different place, or at a different time of year, with thousands of vacation exchange options. It's great for a change of pace, and offers so much flexibility.",
      ],
      "Vacation ownership makes it possible to enjoy life the way it’s meant to be lived – seeing the world’s wonders and spending quality time with your family and friends.",
    ],
  },
  {
    path: "/web/my/info/ownership/overview",
    title: "About Vacation Ownership",
    heading: "About Vacation Ownership",
    eyebrow: "Vacation Ownership",
    summary: "A flexible way to vacation — with the comfort of a resort and the freedom to explore.",
    heroImage: "/images/pages/ownership-hero.jpg",
    paragraphs: [
      "Vacation ownership (often called timeshare or vacation club membership) lets you purchase the right to stay at a resort for a set period each year. Many plans also include points or weeks you can use, save, or exchange.",
      "Compared with booking hotels à la carte, ownership can mean more space, fuller kitchens, and on-site amenities — plus a community of travelers who return season after season.",
      "Interval International partners with resorts and vacation clubs worldwide so owners can exchange their home accommodations for stays at other affiliated resorts.",
    ],
  },
  {
    path: "/web/my/info/ownership/about",
    title: "Why Interval International?",
    heading: "Why Interval International?",
    eyebrow: "Vacation Ownership",
    summary: "Fifty years of helping members see more of the world through vacation exchange.",
    heroImage: "/images/pages/ownership-hero.jpg",
    paragraphs: [
      "Interval International is a leading vacation exchange network. Members deposit their home resort time or points and request stays at other resorts in the Interval network.",
      "Beyond exchange, members can book Getaways — resort vacations without using an exchange — and access travel deals, publications, and tools designed for vacation owners.",
      "Whether you are new to ownership or a long-time member, Interval is built to make planning your next trip clearer and more flexible.",
    ],
  },
  {
    path: "/web/cs/offices",
    title: "Contact Us",
    heading: "Contact Us",
    eyebrow: "Customer Support",
    summary: "We’re here to help with membership, exchanges, Getaways, and account questions.",
    showPlay: false,
    paragraphs: [
      "Interval International provides customer support for members around the world. Reach out by phone, email, or through your online account for help with deposits, confirmations, and travel planning.",
      "For the fastest service, sign in to your Interval account where you can manage exchanges, view confirmations, and update your profile.",
      "Office locations and regional contact numbers are available for members who prefer to speak with a representative in their area.",
    ],
  },

  // —— Explore & Plan ——
  {
    path: "/web/my/info/planning",
    title: "Explore & Plan",
    heading: "Explore & Plan",
    eyebrow: "Explore & Plan",
    summary: "Tools, guides, and inspiration to plan your next Interval vacation.",
    paragraphs: [
      "From the online Resort Directory to Interval HD videos and the Interval app, you have multiple ways to research destinations and lock in your stay.",
      "Browse publications, stay connected with the Interval community, book related travel, and track exchange activity — all from one planning hub.",
    ],
  },
  {
    path: "/web/cs/directory",
    title: "Online Resort Directory",
    heading: "Online Resort Directory",
    eyebrow: "Explore & Plan",
    summary: "Search thousands of resorts in the Interval network by destination, amenity, and more.",
    paragraphs: [
      "The Interval Resort Directory helps you discover places to stay — from Caribbean beaches to European cities and everything in between.",
      "Filter by region, review resort details, and shortlist options that fit your travel style before you request an exchange or book a Getaway.",
      "Popular destinations include Aruba, Orlando, Cancun, Hawaii, and many more. Use View All from the homepage directory to explore the full list.",
    ],
  },
  {
    path: "/web/my/channel",
    title: "Interval HD",
    heading: "Interval HD",
    eyebrow: "Explore & Plan",
    summary: "Now with helpful videos — destination inspiration and how-to guidance for members.",
    paragraphs: [
      "Interval HD brings travel stories and resort highlights to life with video content designed for vacation owners.",
      "Watch destination guides, member tips, and feature overviews so you can plan with more confidence before you book.",
    ],
  },
  {
    path: "/web/cs/mobile-app",
    title: "Interval International App",
    heading: "Interval International App",
    eyebrow: "Explore & Plan",
    summary: "Take your benefits with you — manage membership and plan travel from your phone.",
    showPlay: false,
    paragraphs: [
      "The Interval International app puts exchange tools, Getaways, confirmations, and destination research in your pocket.",
      "Download for iOS or Android to stay productive on the go and keep your next vacation moving forward.",
    ],
  },
  {
    path: "/web/my/info/planning/magazine",
    title: "Member Publications",
    heading: "Member Publications",
    eyebrow: "Explore & Plan",
    summary: "Stories, destination guides, and member news from Interval.",
    paragraphs: [
      "Interval member publications share vacation ideas, resort features, and planning tips throughout the year.",
      "Use articles and guides as a springboard for your next exchange or Getaway — then return to the Resort Directory to check availability options.",
    ],
  },
  {
    path: "/web/my/info/planning/community",
    title: "Stay Connected",
    heading: "Stay Connected",
    eyebrow: "Explore & Plan",
    summary: "Follow Interval and join the conversation with fellow travelers.",
    paragraphs: [
      "Stay connected through Interval’s social channels and community updates for destination inspiration and membership news.",
      "Share photos, find trip ideas, and keep up with special offers that can make your next vacation even better.",
    ],
  },
  {
    path: "/web/my/info/planning/travel",
    title: "Interval Travel",
    heading: "Interval Travel",
    eyebrow: "Explore & Plan",
    summary: "Book flights, cars, and more to complete your resort vacation.",
    paragraphs: [
      "Interval Travel helps members arrange the logistics around a resort stay — including air and car options through trusted partners.",
      "Pair your exchange or Getaway with convenient travel bookings so more of your energy goes into enjoying the destination.",
    ],
  },
  {
    path: "/web/my/info/planning/tracker",
    title: "Interval Exchange Tracker",
    heading: "Interval Exchange Tracker",
    eyebrow: "Explore & Plan",
    summary: "Follow the status of your exchange requests and confirmations.",
    showPlay: false,
    paragraphs: [
      "The Exchange Tracker gives you visibility into deposits, requests, and confirmed stays so you always know where your vacation plans stand.",
      "Sign in to view live status details and take the next step when options become available.",
    ],
  },

  // —— Benefits ——
  {
    path: "/web/my/info/benefits",
    title: "Membership Benefits",
    heading: "Membership Benefits",
    eyebrow: "Member Benefits",
    summary: "Exchange, Getaways, and upgraded membership levels built for vacation owners.",
    heroImage: "/images/pages/benefits-hero.jpg",
    paragraphs: [
      "Interval membership is designed to stretch the value of vacation ownership. Exchange your home week or points for stays across the network, or book Getaways when you want a resort trip without exchanging.",
      "Upgrade options like Interval Gold and Interval Platinum add even more flexibility and perks for frequent travelers.",
    ],
  },
  {
    path: "/web/my/info/benefits/exchange",
    title: "Vacation Exchange",
    heading: "Vacation Exchange",
    eyebrow: "Member Benefits",
    summary: "See more and do more — beyond your home resort and throughout the year.",
    heroImage: "/images/pages/benefits-hero.jpg",
    paragraphs: [
      "Deposit your vacation ownership time or points with Interval, then request a stay at another resort in the network.",
      "Exchange tools help you search by destination and travel dates, and products like E-Plus can add flexibility to change plans when you need to.",
      "It’s one of the core reasons owners join Interval: turn one home resort into a pathway to many.",
    ],
  },
  {
    path: "/web/my/info/benefits/getaways",
    title: "Getaways",
    heading: "Getaways",
    eyebrow: "Member Benefits",
    summary: "Resort vacations without exchanging — priced to help you travel more often.",
    heroImage: "/images/pages/benefits-hero.jpg",
    paragraphs: [
      "Getaways let Interval members book spacious resort accommodations without depositing or exchanging home time.",
      "They are a smart option for short-notice trips, extra vacations, or destinations you want to try before using an exchange.",
      "Browse Getaway inventory online and look for transparent, up-front pricing so planning stays simple.",
    ],
  },
  {
    path: "/web/my/info/benefits/membership",
    title: "Interval Membership",
    heading: "Interval Membership",
    eyebrow: "Member Benefits",
    summary: "Your foundation for exchange, Getaways, and Interval travel benefits.",
    heroImage: "/images/pages/membership-hero.jpg",
    paragraphs: [
      "Basic Interval membership connects vacation owners to the exchange network and member resources.",
      "From online planning tools to customer support, membership is the key that unlocks Interval’s core products.",
    ],
  },
  {
    path: "/web/my/info/benefits/gold",
    title: "Interval Gold",
    heading: "Interval Gold",
    eyebrow: "Member Benefits",
    summary: "Enhanced benefits for members who want more flexibility and value.",
    heroImage: "/images/pages/membership-hero.jpg",
    paragraphs: [
      "Interval Gold builds on standard membership with additional benefits designed for travelers who exchange and book more often.",
      "Ask a representative or review your account for current Gold inclusions, upgrade options, and renewal details.",
    ],
  },
  {
    path: "/web/my/info/benefits/platinum",
    title: "Interval Platinum",
    heading: "Interval Platinum",
    eyebrow: "Member Benefits",
    summary: "Premium membership for the most active Interval travelers.",
    heroImage: "/images/pages/membership-hero.jpg",
    paragraphs: [
      "Interval Platinum is the top tier for members who want the highest level of Interval benefits and recognition.",
      "Review Platinum details in your account or with Interval support to see if an upgrade fits your travel style.",
    ],
  },
  {
    path: "/web/my/info/benefits/offers",
    title: "Special Offers",
    heading: "Special Offers",
    eyebrow: "Member Benefits",
    summary: "Limited-time deals on exchanges, Getaways, and more.",
    heroImage: "/images/pages/benefits-hero.jpg",
    paragraphs: [
      "Interval regularly features special offers that can reduce fees, highlight Getaway pricing, or promote seasonal destinations.",
      "Check the homepage carousel and this offers page often — promotions change throughout the year.",
    ],
  },

  // —— Join / account / auth ——
  {
    path: "/web/my/info/membership",
    title: "Join Today",
    heading: "Join Today",
    eyebrow: "Membership",
    summary: "Become an Interval International member and open a world of vacation possibilities.",
    heroImage: "/images/pages/membership-hero.jpg",
    paragraphs: [
      "If you own vacation ownership through a participating resort or club, Interval membership can help you exchange, book Getaways, and plan with member tools.",
      "Create a profile to get started, or sign in if you already have an Interval account.",
      "Have questions about eligibility? Contact Interval support or your home resort for guidance.",
    ],
  },
  {
    path: "/web/my/account/createProfileOrJoin",
    title: "Create Profile",
    heading: "Create Profile",
    eyebrow: "Account",
    summary: "Set up your Interval profile to join or manage your membership.",
    showPlay: false,
    paragraphs: [
      "Creating a profile is the first step toward accessing Interval online services.",
      "This demo page stands in for the live enrollment flow. In production, this screen would collect account details and verify membership eligibility.",
      "Already a member? Sign in to continue to your account home.",
    ],
  },

  // —— Other / footer ——
  {
    path: "/web/my/deals",
    title: "Special Deals",
    heading: "Special Deals",
    eyebrow: "Offers",
    summary: "Featured exchange and Getaway promotions for Interval members.",
    heroImage: "/images/pages/benefits-hero.jpg",
    paragraphs: [
      "Promotional banners on the homepage highlight current deals such as exchange specials and Getaway pricing.",
      "Sign in to confirm eligibility and complete booking steps for any offer you select.",
    ],
  },
  {
    path: "/web/cs/travel-advisories",
    title: "Travel Advisories",
    heading: "Travel Advisories",
    eyebrow: "Important Member Information",
    summary: "Resort closures and travel updates that may affect your plans.",
    showPlay: false,
    paragraphs: [
      "Interval publishes travel advisories so members can check resort status before finalizing plans.",
      "Please review this page frequently — conditions can change, and staying informed helps protect your vacation.",
    ],
  },
  {
    path: "/web/cs/about",
    title: "About Interval",
    heading: "About Interval",
    eyebrow: "Company",
    summary: "Interval International — connecting vacation owners to a global resort network.",
    heroImage: "/images/pages/benefits-hero.jpg",
    paragraphs: [
      "For decades, Interval International has helped vacation owners exchange home accommodations and discover new destinations.",
      "Today Interval continues to invest in digital tools, member benefits, and resort partnerships that make ownership more rewarding.",
    ],
  },
  {
    path: "/web/cs/legal",
    title: "Legal Information",
    heading: "Legal Information",
    eyebrow: "Legal",
    summary: "Terms, disclosures, and legal notices for Interval International services.",
    showPlay: false,
    paragraphs: [
      "This demo page represents Interval’s legal information hub. Production content includes terms of use, exchange rules, and related disclosures.",
      "For binding legal terms, always refer to the documents provided during enrollment and in your member account.",
    ],
  },
  {
    path: "/web/cs/customer-service",
    title: "Customer Support",
    heading: "Customer Support",
    eyebrow: "Support",
    summary: "Help with your Interval membership, reservations, and online account.",
    showPlay: false,
    paragraphs: [
      "Customer Support can assist with login issues, exchange questions, Getaway bookings, and general membership guidance.",
      "Have your member number ready when you contact us for faster service.",
    ],
  },
  {
    path: "/web/cs/help-login",
    title: "FAQs",
    heading: "FAQs",
    eyebrow: "Support",
    summary: "Answers to common questions about signing in, exchanging, and using Interval online.",
    showPlay: false,
    paragraphs: [
      "Find help with passwords, profile setup, exchange basics, Getaways, and more.",
      "If you still need assistance after reviewing FAQs, contact Customer Support or visit the Contact Us page for regional options.",
    ],
  },
  {
    path: "/web/cs/eplus",
    title: "E-Plus",
    heading: "E-Plus",
    eyebrow: "Member Benefits",
    summary: "Flex more exchange muscle — change destinations, resorts, and travel dates.",
    heroImage: "/images/pages/benefits-hero.jpg",
    paragraphs: [
      "E-Plus is designed to give members more flexibility after an exchange is under way.",
      "Use it when plans change and you need options beyond a standard exchange confirmation.",
    ],
  },
  {
    path: "/web/cs/deposit",
    title: "Deposit for Flexibility",
    heading: "Deposit for Flexibility",
    eyebrow: "Exchange",
    summary: "Deposit your vacation ownership for the ultimate flexibility.",
    heroImage: "/images/pages/ownership-hero.jpg",
    paragraphs: [
      "Depositing with Interval is how you enter the exchange system and open opportunities at other resorts.",
      "Sign in to begin a deposit or review deposit guidelines for your membership type.",
    ],
  },
];

const pageMap = new Map(sitePages.map((page) => [page.path, page]));

export function getPageByPath(path: string): SitePage | undefined {
  const normalized = path.replace(/\/$/, "") || "/";
  return pageMap.get(normalized);
}

export function getAllPagePaths(): string[] {
  return sitePages.map((page) => page.path);
}
