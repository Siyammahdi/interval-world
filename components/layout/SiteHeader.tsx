import Image from "next/image";
import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { LanguageSelect } from "@/components/layout/LanguageSelect";
import { MegaNav } from "@/components/layout/MegaNav";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { isLoggedIn } from "@/lib/session";

export async function SiteHeader() {
  const loggedIn = await isLoggedIn();

  return (
    <header className="w-full">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-3 focus:py-2 focus:text-iw-blue"
      >
        Skip to Main Content
      </a>

      {/* Navy utility strip — matches page_bg.gif height (~44px) */}
      <div className="bg-iw-navy">
        <Container className="flex h-[44px] items-center justify-end">
          <LanguageSelect />
        </Container>
      </div>

      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4 pb-3 pt-6">
          <Link href="/" className="block shrink-0" aria-label="Interval International Home">
            <Image
              src="/images/ui/logo-50.svg"
              alt="Interval — 50 Years"
              width={520}
              height={90}
              priority
              className="h-[90px] w-auto max-w-[min(100%,520px)] object-contain object-left"
            />
          </Link>

          <div className="mb-1 ml-auto flex items-center gap-4">
            {loggedIn ? (
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="inline-flex min-w-[86px] items-center justify-center rounded-md border border-iw-blue bg-white px-5 py-2 text-[14px] text-iw-blue transition-colors hover:bg-iw-blue hover:text-white"
                >
                  Log Out
                </button>
              </form>
            ) : (
              <>
                <Link
                  href="/web/my/account/createProfileOrJoin"
                  className="text-[11px] text-iw-blue hover:underline"
                >
                  Create Profile
                </Link>
                <Button href="/web/my/auth/loginPage" className="min-w-[86px] px-5 py-2 text-[14px]">
                  Sign In
                </Button>
              </>
            )}
          </div>
        </div>
      </Container>

      <Container className="relative z-30">
        <MegaNav />
      </Container>
    </header>
  );
}
