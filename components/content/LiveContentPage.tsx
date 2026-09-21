import { CreateProfilePage } from "@/components/content/CreateProfilePage";
import { CsSupportLayout } from "@/components/content/CsSupportLayout";
import { EmailUsForm } from "@/components/content/EmailUsForm";
import { FaqContent } from "@/components/content/FaqContent";
import { IntervalHdPage } from "@/components/content/IntervalHdPage";
import { LoginForm } from "@/components/content/LoginForm";
import { LoginHelpContent } from "@/components/content/LoginHelpContent";
import { MarketingLiveShell } from "@/components/content/MarketingLiveShell";
import { OfficesContent } from "@/components/content/OfficesContent";
import { TrackerPage } from "@/components/content/TrackerPage";
import { Container } from "@/components/ui/Container";
import type { IntervalHdData } from "@/data/interval-hd";
import type { LivePage } from "@/data/live-pages";
import type { TrackerContent, TrackerTrip } from "@/data/tracker";
import { fetchIntervalHd, fetchTracker, type LivePage as CmsLivePage } from "@/lib/cms";
import { rewriteLiveHtmlLinks } from "@/lib/rewrite-live-links";

type Props = {
  page: LivePage | CmsLivePage;
};

const CS_LAYOUTS = new Set(["cs", "cs-offices"]);

function isCsPage(page: Props["page"]) {
  return (
    CS_LAYOUTS.has(page.layout) ||
    page.path.startsWith("/web/cs/") ||
    page.path === "/web/my/account/forgotSignInInfo"
  );
}

function isMarketingInfoPage(page: Props["page"]) {
  return page.path.startsWith("/web/my/info/");
}

/**
 * Renders exact markup extracted from intervalworld.com,
 * styled with the live #p101_* / CS / Interval HD layout rules.
 */
export async function LiveContentPage({ page }: Props) {
  if (page.layout === "interval-hd" || page.path === "/web/my/channel") {
    const hd = (await fetchIntervalHd()) as IntervalHdData;
    return <IntervalHdPage data={hd} />;
  }

  if (page.path === "/web/my/auth/loginPage" || page.layout === "login") {
    return <LoginForm />;
  }

  if (page.path === "/web/my/account/createProfileOrJoin" || page.layout === "form") {
    return <CreateProfilePage />;
  }

  if (page.layout === "tracker" || page.path === "/web/my/info/planning/tracker") {
    const tracker = await fetchTracker();
    return (
      <TrackerPage
        content={tracker.content as TrackerContent}
        trips={tracker.trips as TrackerTrip[]}
      />
    );
  }

  const bodyHtml = rewriteLiveHtmlLinks(page.bodyHtml);

  if (isCsPage(page) && page.path !== "/web/cs/directory" && page.path !== "/web/cs/mobile-app") {
    let content: React.ReactNode;

    if (page.path === "/web/cs/email-us" || page.path === "/web/cs/customer-service") {
      content = <EmailUsForm />;
    } else if (page.path === "/web/cs/help-login") {
      content = <FaqContent html={page.bodyHtml} />;
    } else if (page.path === "/web/my/account/forgotSignInInfo") {
      content = <LoginHelpContent html={page.bodyHtml} />;
    } else if (page.layout === "cs-offices" || page.path === "/web/cs/offices") {
      content = <OfficesContent html={bodyHtml} />;
    } else {
      content = (
        <div
          className="iw-cs-inner"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      );
    }

    return <CsSupportLayout activePath={page.path}>{content}</CsSupportLayout>;
  }

  if (isMarketingInfoPage(page)) {
    return (
      <MarketingLiveShell title={page.title}>
        <div dangerouslySetInnerHTML={{ __html: bodyHtml }} />
      </MarketingLiveShell>
    );
  }

  return (
    <main id="main-content" className="iw-live-page pb-8 pt-2">
      <Container>
        <div
          className="iw-live-body clearfix"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </Container>
    </main>
  );
}
