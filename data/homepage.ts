import {
  fetchHomepage,
  type BenefitCard,
  type Destination,
  type HeroSlide,
  type HomepageData,
  type MemberAlert,
} from "@/lib/cms";

export type { BenefitCard, Destination, HeroSlide, HomepageData, MemberAlert };

/** @deprecated Prefer fetchHomepage() — kept for type-only imports during migration */
export async function getHomepage() {
  return fetchHomepage();
}
