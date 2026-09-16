import { CreateProfilePage } from "@/components/content/CreateProfilePage";
import { CsSupportLayout } from "@/components/content/CsSupportLayout";
import { IntervalHdPage } from "@/components/content/IntervalHdPage";
import { LoginForm } from "@/components/content/LoginForm";
import { OfficesContent } from "@/components/content/OfficesContent";
import { TrackerPage } from "@/components/content/TrackerPage";
import { Container } from "@/components/ui/Container";
import { intervalHd } from "@/data/interval-hd";
import type { LivePage } from "@/data/live-pages";

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

  if (isCsPage(page) && page.path !== "/web/cs/directory" && page.path !== "/web/cs/mobile-app") {
    const content =
      page.layout === "cs-offices" || page.path === "/web/cs/offices" ? (
        <OfficesContent html={page.bodyHtml} />
      ) : (
        <div
          className="iw-cs-inner"
          dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
        />
      );

    return <CsSupportLayout activePath={page.path}>{content}</CsSupportLayout>;
  }

  return (
    <main id="main-content" className="iw-live-page pb-8 pt-2">
      <Container>
        <div
          className="iw-live-body clearfix"
          dangerouslySetInnerHTML={{ __html: page.bodyHtml }}
        />
      </Container>
    </main>
  );
}
