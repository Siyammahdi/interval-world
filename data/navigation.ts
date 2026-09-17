export type NavChild = {
  label: string;
  href: string;
};

export type NavItem = {
  id: string;
  label: string;
  href: string;
  /** Sprite image used on the live site nav tabs */
  image: string;
  children: NavChild[];
};

export const languages = [
  { label: "English", href: "/", code: "en" },
  { label: "Deutsch", href: "https://de.intervalworld.com", code: "de" },
  { label: "Español", href: "https://es.intervalworld.com", code: "es" },
  { label: "Français", href: "https://fr.intervalworld.com", code: "fr" },
  { label: "Italiano", href: "https://it.intervalworld.com", code: "it" },
  { label: "Português", href: "https://pt.intervalworld.com", code: "pt" },
  { label: "中文", href: "https://zh.intervalworld.com", code: "zh" },
  { label: "Tiếng Việt", href: "https://vi.intervalworld.com", code: "vi" },
] as const;

export const mainNav: NavItem[] = [
  {
    id: "ownership",
    label: "Why Vacation Ownership?",
    href: "/web/my/info/ownership",
    image: "/images/nav/prelogin_01.jpg",
    children: [
      { label: "About Vacation Ownership", href: "/web/my/info/ownership/overview" },
      { label: "Why Interval International?", href: "/web/my/info/ownership/about" },
      { label: "Contact Us", href: "/web/cs/offices" },
    ],
  },
  {
    id: "resort-directory",
    label: "Resort Directory",
    href: "/resort-directory",
    image: "/images/nav/prelogin_02.jpg",
    children: [],
  },
  {
    id: "planning",
    label: "Explore & Plan",
    href: "/web/my/info/planning",
    image: "/images/nav/prelogin_02.jpg",
    children: [
      { label: "Online Resort Directory", href: "/resort-directory" },
      { label: "Interval HD", href: "/web/my/channel" },
      { label: "Interval International App", href: "/web/cs/mobile-app" },
      { label: "Member Publications", href: "/web/my/info/planning/magazine" },
      { label: "Stay Connected", href: "/web/my/info/planning/community" },
      { label: "Interval Travel", href: "/web/my/info/planning/travel" },
      { label: "Interval Exchange Tracker", href: "/web/my/info/planning/tracker" },
    ],
  },
  {
    id: "benefits",
    label: "Member Benefits",
    href: "/web/my/info/benefits",
    image: "/images/nav/prelogin_03.jpg",
    children: [
      { label: "Exchange", href: "/web/my/info/benefits/exchange" },
      { label: "Getaways", href: "/web/my/info/benefits/getaways" },
      { label: "Interval Membership", href: "/web/my/info/benefits/membership" },
      { label: "Interval Gold", href: "/web/my/info/benefits/gold" },
      { label: "Interval Platinum", href: "/web/my/info/benefits/platinum" },
      { label: "Special Offers", href: "/web/my/info/benefits/offers" },
    ],
  },
  {
    id: "join",
    label: "Join Today",
    href: "/web/my/info/membership",
    image: "/images/nav/prelogin_04.jpg",
    children: [{ label: "Join Today", href: "/web/my/info/membership" }],
  },
];

export const footerLinks = [
  { label: "About Interval", href: "/web/cs/about" },
  { label: "Privacy and Cookie Policies", href: "https://privacy.intervalworld.com/" },
  { label: "Cookie Settings", href: "#cookie-settings" },
  {
    label: "Do Not Sell/Share",
    href: "https://privacy-portal-mvwc.my.onetrust.com/webform/711fd727-975b-4078-b1d2-af57070c5360/f9e7eb79-730f-4eca-9723-b7936424f67e",
  },
  { label: "Legal Information", href: "/web/cs/legal" },
  { label: "Accessibility", href: "https://www.levelaccess.com/a/interval/" },
  { label: "Customer Support", href: "/web/cs/customer-service" },
  { label: "FAQs", href: "/web/cs/help-login" },
] as const;

export const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/IntervalInternational",
    icon: "/images/social/facebook.jpg",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/intervalinternational/",
    icon: "/images/social/instagram.png",
  },
  {
    label: "Youtube",
    href: "https://www.youtube.com/user/IntervalIntl",
    icon: "/images/social/youtube.jpg",
  },
  {
    label: "Pinterest",
    href: "https://www.pinterest.com/intervalintl/",
    icon: "/images/social/pinterest.jpg",
  },
] as const;
