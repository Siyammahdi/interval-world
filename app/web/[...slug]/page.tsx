import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AboutVacationOwnershipPage } from "@/components/content/AboutVacationOwnershipPage";
import { CreateProfilePage } from "@/components/content/CreateProfilePage";
import { ExchangePage } from "@/components/content/ExchangePage";
import { ExplorePlanPage } from "@/components/content/ExplorePlanPage";
import { GetawaysPage } from "@/components/content/GetawaysPage";
import { IntervalAppPage } from "@/components/content/IntervalAppPage";
import { IntervalGoldPage } from "@/components/content/IntervalGoldPage";
import { IntervalMembershipPage } from "@/components/content/IntervalMembershipPage";
import { IntervalPlatinumPage } from "@/components/content/IntervalPlatinumPage";
import { IntervalTravelPage } from "@/components/content/IntervalTravelPage";
import { JoinTodayPage } from "@/components/content/JoinTodayPage";
import { LiveContentPage } from "@/components/content/LiveContentPage";
import { LoginForm } from "@/components/content/LoginForm";
import { MemberPublicationsPage } from "@/components/content/MemberPublicationsPage";
import { MembershipBenefitsPage } from "@/components/content/MembershipBenefitsPage";
import { SpecialOffersPage } from "@/components/content/SpecialOffersPage";
import { StayConnectedPage } from "@/components/content/StayConnectedPage";
import { WhyIntervalPage } from "@/components/content/WhyIntervalPage";
import { WhyVacationOwnershipPage } from "@/components/content/WhyVacationOwnershipPage";
import { getLivePageByPath } from "@/data/live-pages";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

const FIGMA_MARKETING_PATHS = [
  "/web/my/info/ownership",
  "/web/my/info/ownership/overview",
  "/web/my/info/ownership/about",
  "/web/my/info/planning",
  "/web/my/info/planning/magazine",
  "/web/my/info/planning/community",
  "/web/my/info/planning/travel",
  "/web/my/info/benefits",
  "/web/my/info/benefits/exchange",
  "/web/my/info/benefits/getaways",
  "/web/my/info/benefits/membership",
  "/web/my/info/benefits/gold",
  "/web/my/info/benefits/platinum",
  "/web/my/info/benefits/offers",
  "/web/my/info/membership",
  "/web/cs/mobile-app",
] as const;

const FIGMA_PAGE_TITLES: Record<string, string> = {
  "/web/my/info/ownership": "Why Vacation Ownership",
  "/web/my/info/ownership/overview": "About Vacation Ownership",
  "/web/my/info/ownership/about": "Why Interval International?",
  "/web/my/info/planning": "Explore & Plan",
  "/web/my/info/planning/magazine": "Member Publications",
  "/web/my/info/planning/community": "Stay Connected",
  "/web/my/info/planning/travel": "Vacation Planning made easy",
  "/web/my/info/benefits": "Membership Benefits",
  "/web/my/info/benefits/exchange": "Exchange",
  "/web/my/info/benefits/getaways": "Getaways",
  "/web/my/info/benefits/membership": "Interval Membership",
  "/web/my/info/benefits/gold": "Interval Gold",
  "/web/my/info/benefits/platinum": "Interval Platinum",
  "/web/my/info/benefits/offers": "Special Offers",
  "/web/my/info/membership": "Join Today",
  "/web/cs/mobile-app": "Interval International App",
};

function pathFromSlug(slug: string[]) {
  return `/web/${slug.join("/")}`;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = pathFromSlug(slug);
  if (FIGMA_PAGE_TITLES[path]) return { title: FIGMA_PAGE_TITLES[path] };

  const page = await getLivePageByPath(path);
  if (!page) return { title: "Page Not Found" };
  return {
    title: page.title,
    description: page.documentTitle || page.title,
  };
}

export default async function WebCatchAllPage({ params }: PageProps) {
  const { slug } = await params;
  const path = pathFromSlug(slug);

  if (path === "/web/my/auth/loginPage") return <LoginForm />;
  if (path === "/web/my/account/createProfileOrJoin") return <CreateProfilePage />;

  if (path === "/web/my/info/ownership") return <WhyVacationOwnershipPage />;
  if (path === "/web/my/info/ownership/overview") return <AboutVacationOwnershipPage />;
  if (path === "/web/my/info/ownership/about") return <WhyIntervalPage />;

  if (path === "/web/my/info/planning") return <ExplorePlanPage />;
  if (path === "/web/my/info/planning/magazine") return <MemberPublicationsPage />;
  if (path === "/web/my/info/planning/community") return <StayConnectedPage />;
  if (path === "/web/my/info/planning/travel") return <IntervalTravelPage />;
  if (path === "/web/cs/mobile-app") return <IntervalAppPage />;

  if (path === "/web/my/info/benefits") return <MembershipBenefitsPage />;
  if (path === "/web/my/info/benefits/exchange") return <ExchangePage />;
  if (path === "/web/my/info/benefits/getaways") return <GetawaysPage />;
  if (path === "/web/my/info/benefits/membership") return <IntervalMembershipPage />;
  if (path === "/web/my/info/benefits/gold") return <IntervalGoldPage />;
  if (path === "/web/my/info/benefits/platinum") return <IntervalPlatinumPage />;
  if (path === "/web/my/info/benefits/offers") return <SpecialOffersPage />;

  if (path === "/web/my/info/membership") return <JoinTodayPage />;

  const page = await getLivePageByPath(path);
  if (!page) notFound();
  return <LiveContentPage page={page} />;
}

// Keep path list for reference / future static generation (API-backed at runtime).
void FIGMA_MARKETING_PATHS;
