import Image from "next/image";
import Link from "next/link";
import { logoutAction } from "@/app/actions/auth";
import { LanguageSelect } from "@/components/layout/LanguageSelect";
import { MegaNav } from "@/components/layout/MegaNav";
import { fetchNavigation } from "@/lib/cms";
import { isLoggedIn } from "@/lib/session";

export async function SiteHeader() {
  const [loggedIn, navigation] = await Promise.all([isLoggedIn(), fetchNavigation()]);

  return (
    <header className="relative z-[60] w-full overflow-visible bg-white">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-white focus:px-3 focus:py-2 focus:text-iw-blue"
      >
        Skip to Main Content
      </a>

      <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between gap-4 px-6 py-0 md:px-[120px]">
        <Link href="/" className="block shrink-0" aria-label="Interval International Home">
          <Image
            src="/images/figma/home/logo-50.png"
            alt="Interval — 50 Years"
            width={588}
            height={87}
            priority
            className="h-[72px] w-auto max-w-[min(100%,420px)] object-contain object-left md:h-[87px]"
          />
        </Link>

        <div className="flex items-center gap-3 md:gap-4">
          <LanguageSelect languages={navigation.languages} />
          {loggedIn ? (
            <form action={logoutAction}>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-lg bg-iw-blue px-[42px] py-3 text-[17px] font-medium text-white transition-colors hover:bg-iw-blue-dark"
              >
                Log Out
              </button>
            </form>
          ) : (
            <>
              <Link
                href="/web/my/account/createProfileOrJoin"
                className="hidden rounded-lg px-2 py-3 text-[17px] font-medium text-iw-ink transition-colors hover:text-iw-blue sm:inline-flex"
              >
                Create Profile
              </Link>
              <Link
                href="/web/my/auth/loginPage"
                className="inline-flex items-center justify-center rounded-lg bg-iw-blue px-6 py-3 text-[17px] font-medium text-white transition-colors hover:bg-iw-blue-dark md:px-[42px]"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>

      <MegaNav items={navigation.mainNav} />
    </header>
  );
}
