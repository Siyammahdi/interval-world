import { AppPromo } from "@/components/home/AppPromo";
import { AskExpert } from "@/components/home/AskExpert";
import { FeatureModules } from "@/components/home/FeatureModules";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { InspirationSection } from "@/components/home/InspirationSection";
import { MemberAlert } from "@/components/home/MemberAlert";
import { MapSearchSection } from "@/components/resorts/MapSearchSection";
import { fetchDirectoryMeta, fetchHomepage, fetchNavigation } from "@/lib/cms";

export default async function HomePage() {
  const [{ heroSlides, memberAlert, benefitCards }, navigation, directory] = await Promise.all([
    fetchHomepage(),
    fetchNavigation(),
    fetchDirectoryMeta(),
  ]);

  return (
    <main id="main-content" className="w-full">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-8 px-4 pb-16 pt-8 md:px-[120px] md:pb-[100px]">
        <HeroCarousel slides={heroSlides} />
        <div className="flex w-full flex-col items-center gap-9">
          <MemberAlert alert={memberAlert} />
          <FeatureModules cards={benefitCards} />
        </div>
      </div>
      <InspirationSection />
      <AppPromo />
      <AskExpert socialLinks={navigation.socialLinks} />
      <div className="w-full border-t border-iw-muted bg-white">
        <div className="mx-auto w-full max-w-[1440px] px-4 py-[60px] md:px-[120px] md:py-[80px]">
          <MapSearchSection regions={directory.mapSearchRegions || []} />
        </div>
      </div>
    </main>
  );
}
