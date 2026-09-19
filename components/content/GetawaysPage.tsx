import Link from "next/link";
import { FeatureGridPage } from "@/components/content/FeatureGridPage";

const CARDS = [
  {
    title: "Super Affordable",
    image: "/images/figma/getaways/affordable.jpg",
    body: "Getaways provide members with unsurpassed value for their vacation dollar. Getaways are resort stays in destinations around the world, in spacious accommodations and are available for seven nights or less.",
  },
  {
    title: "Room to Move",
    image: "/images/figma/getaways/room.jpg",
    body: "Getaways are perfect for every traveling party, however large or small. Accommodations range from intimate studios to multibedroom units with separate living and dining areas. And many have full kitchens!",
  },
  {
    title: "No Exchange Required",
    image: "/images/figma/getaways/no-exchange.jpg",
    body: "Getaways can be enjoyed at any time without ever having to exchange your home resort week or points. So, travel more often and try exciting new destinations, year after year!",
  },
  {
    title: "Vacation Hotspots",
    image: "/images/figma/getaways/hotspots.jpg",
    body: "Getaways can put you where you want to be. From tropical islands to theme parks to world-class cities like New York and Paris, Getaways offer so much variety, value, and fun!",
  },
  {
    title: "Discounts",
    image: "/images/figma/getaways/discounts.jpg",
    body: "All Interval members get $25 off Getaways booked during their first year of membership. Interval Gold® members receive an additional $25 off, and Interval Platinum® members get $50 off (Discounts only apply to stays of 4 nights or more).",
  },
  {
    title: "Always the Best Rates",
    image: "/images/figma/getaways/rates.jpg",
    body: (
      <>
        With Interval&apos;s Best Price Guarantee, you can rest assured you&apos;ll always get a great
        rate on Getaways. For complete terms and conditions of the Best Price Guarantee program,{" "}
        <Link href="/web/cs" className="text-iw-link underline">
          click here
        </Link>
        .
      </>
    ),
  },
];

export function GetawaysPage() {
  return (
    <FeatureGridPage
      title="Getaways"
      breadcrumbs={[{ label: "Home", href: "/" }, { label: "Getaways" }]}
      heroImage="/images/figma/getaways/hero.jpg"
      heroAlt="Kayaks in a coastal cove"
      showPlay={false}
      showViewDetails
      cards={CARDS}
    />
  );
}
