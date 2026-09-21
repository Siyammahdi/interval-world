import { AppPromo } from "@/components/home/AppPromo";
import { AskExpert } from "@/components/home/AskExpert";
import { FeatureModules } from "@/components/home/FeatureModules";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { MemberAlert } from "@/components/home/MemberAlert";
import { ResortDirectory } from "@/components/home/ResortDirectory";
import { fetchHomepage, fetchNavigation } from "@/lib/cms";

export default async function HomePage() {
  const [{ heroSlides, memberAlert, benefitCards, destinations }, navigation] = await Promise.all([
    fetchHomepage(),
    fetchNavigation(),
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
      <ResortDirectory destinations={destinations} />
      <AppPromo />
      <AskExpert socialLinks={navigation.socialLinks} />
    </main>
  );
}
