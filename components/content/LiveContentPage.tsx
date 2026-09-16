import { CreateProfilePage } from "@/components/content/CreateProfilePage";
import { CsSupportLayout } from "@/components/content/CsSupportLayout";
import { EmailUsForm } from "@/components/content/EmailUsForm";
import { FaqContent } from "@/components/content/FaqContent";
import { IntervalHdPage } from "@/components/content/IntervalHdPage";
import { LoginForm } from "@/components/content/LoginForm";
import { LoginHelpContent } from "@/components/content/LoginHelpContent";
import { OfficesContent } from "@/components/content/OfficesContent";
import { TrackerPage } from "@/components/content/TrackerPage";
import { Container } from "@/components/ui/Container";
import { intervalHd } from "@/data/interval-hd";
import type { LivePage } from "@/data/live-pages";
import { rewriteLiveHtmlLinks } from "@/lib/rewrite-live-links";

type Props = {
  page: LivePage;
};

const CS_LAYOUTS = new Set(["cs", "cs-offices"]);

function isCsPage(page: LivePage) {
  return (
    CS_LAYOUTS.has(page.layout) ||
    page.path.startsWith("/web/cs/") ||
    page.path === "/web/my/account/forgotSignInInfo"
  );
}

/**
 * Renders exact markup extracted from intervalworld.com,
 * styled with the live #p101_* / CS / Interval HD layout rules.
 */
export function LiveContentPage({ page }: Props) {
  if (page.layout === "interval-hd" || page.path === "/web/my/channel") {
    return <IntervalHdPage data={intervalHd} />;
  }

  if (page.path === "/web/my/auth/loginPage" || page.layout === "login") {
    return <LoginForm />;
  }

  if (page.path === "/web/my/account/createProfileOrJoin" || page.layout === "form") {
    return <CreateProfilePage />;
  }

  if (page.layout === "tracker" || page.path === "/web/my/info/planning/tracker") {
    return <TrackerPage />;
  }

  const bodyHtml = rewriteLiveHtmlLinks(page.bodyHtml);

  if (isCsPage(page) && page.path !== "/web/cs/directory" && page.path !== "/web/cs/mobile-app") {
    let content: React.ReactNode;

    if (page.path === "/web/cs/email-us") {
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
