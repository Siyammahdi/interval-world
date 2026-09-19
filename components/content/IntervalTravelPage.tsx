import { FeatureGridPage } from "@/components/content/FeatureGridPage";

const CARDS = [
  {
    title: "Find a Room",
    image: "/images/figma/travel/room.jpg",
    body: "Your Interval International® membership gives you access to incredible hotel deals through Priceline Partner Solutions™ — check in with members-only rates and extra discounts on 1.2 million hotels around the world. Book your next stay at a price you'll love.",
  },
  {
    title: "Arrive in Style",
    image: "/images/figma/travel/car.jpg",
    body: "Enjoy special savings on car rentals with Hertz®. Enroll in Hertz Gold Plus Rewards® for free and take advantage of added perks. Or upgrade to Interval Gold® or Interval Platinum® for even more car rental benefits.",
  },
  {
    title: "Suite Deals",
    image: "/images/figma/travel/suite.jpg",
    body: "Want a short break of less than seven nights? Looking for a weekend escape? Receive great deals on resorts and hotels worldwide.",
  },
  {
    title: "Get on Board",
    image: "/images/figma/travel/cruise.jpg",
    body: "Receive members-only rates and get up to $200 onboard credit. And, with our Best Price Guarantee on cruises, know you're getting a great deal.",
  },
  {
    title: "See the World",
    image: "/images/figma/travel/tour.jpg",
    body: "Take advantage of Interval's tour offerings, including Collette®, and experience the difference of guided travel! Interval Gold® and Interval Platinum® members: You can exchange your week or use your points toward an Interval Options® tour exchange.",
  },
  {
    title: "Do it All",
    image: "/images/figma/travel/activities.jpg",
    body: "Choose from over 300,000 things to do - day trips, show tickets, sightseeing tours, and popular activities in hundreds of destinations worldwide.",
  },
] as const;

export function IntervalTravelPage() {
  return (
    <FeatureGridPage
      title="Vacation Planning made easy"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Vacation Planning made easy" },
      ]}
      heroImage="/images/figma/travel/hero.jpg"
      heroAlt="Tropical coastal resort with Interval Travel branding"
      showPlay={false}
      showViewDetails
      heroCta={{ label: "Book Now", href: "/web/my/info/planning/travel" }}
      cards={[...CARDS]}
    />
  );
}
