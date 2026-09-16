import { FeatureModules } from "@/components/home/FeatureModules";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { MemberAlert } from "@/components/home/MemberAlert";
import { ResortDirectory } from "@/components/home/ResortDirectory";
import { Container } from "@/components/ui/Container";
import { benefitCards, destinations, heroSlides } from "@/data/homepage";

export default function HomePage() {
  return (
    <main id="main-content" className="pb-2 pt-3">
      <Container>
        <HeroCarousel slides={heroSlides} />
        <MemberAlert />
        <FeatureModules cards={benefitCards} />
        <ResortDirectory destinations={destinations} />
      </Container>
    </main>
  );
}
