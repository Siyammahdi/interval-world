import { FeatureGridPage } from "@/components/content/FeatureGridPage";

const CARDS = [
  {
    title: "Deposit First",
    image: "/images/figma/exchange/deposit.jpg",
    body: "Use Deposit First when you are sure you want a different vacation experience. You'll enjoy the flexibility of up to a four-year travel window — allowing you to exchange anytime from two years before to two years after the first day of your home resort week.",
  },
  {
    title: "Request First",
    image: "/images/figma/exchange/request.jpg",
    body: "If you want the security of retaining your home resort week until you receive an exchange confirmation, use Request First. Place a request and travel from two years before the week you offer in exchange up until the dates of that week. If you are a points-based member, use Request First.",
  },
  {
    title: "Flexchange",
    image: "/images/figma/exchange/flexchange.jpg",
    body: "Looking to travel sooner rather than later? Flexchange® it! You'll use Flexchange when you request a vacation exchange from 30 days to 24 hours before check-in. Last-minute travel's never been easier.",
  },
  {
    title: "ShortStay Exchange",
    image: "/images/figma/exchange/shortstay.jpg",
    body: "Turn your resort week into two shorter vacations of six nights or less. Points-based members can make as many ShortStay Exchanges® as their points allow. ShortStay Exchange gives you the flexibility to enjoy breaks that fit your schedule!",
  },
  {
    title: "E-Plus",
    image: "/images/figma/exchange/eplus.jpg",
    body: "With E-Plus, you can retrade up to three times for a low one-time fee. Change destinations, resorts, or travel dates — more than 14 days before check-in.",
  },
  {
    title: "Interval Options®",
    image: "/images/figma/exchange/options.jpg",
    body: "Exchange your week or points toward a cruise, tour, golf vacation, spa vacation, or hotel stay.",
  },
] as const;

export function ExchangePage() {
  return (
    <FeatureGridPage
      title="Exchange"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Exchange" }]}
      heroImage="/images/figma/exchange/hero.jpg"
      heroAlt="Resort pool and palm trees"
      cards={[...CARDS]}
    />
  );
}
