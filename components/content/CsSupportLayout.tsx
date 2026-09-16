import Link from "next/link";
import { Container } from "@/components/ui/Container";

export type CsNavItem = {
  label: string;
  href: string;
  /** Match against current path to highlight */
  match?: string | string[];
};

export const customerSupportNav: CsNavItem[] = [
  { label: "Log In Help", href: "/web/my/account/forgotSignInInfo", match: "/web/my/account/forgotSignInInfo" },
  { label: "Sign in FAQs", href: "/web/cs/help-login", match: "/web/cs/help-login" },
  { label: "E-mail Us", href: "/web/cs/email-us", match: "/web/cs/email-us" },
  { label: "Our Offices", href: "/web/cs/offices", match: "/web/cs/offices" },
];

type CsSupportLayoutProps = {
  activePath: string;
  children: React.ReactNode;
};

function isActive(item: CsNavItem, activePath: string) {
  const matches = Array.isArray(item.match) ? item.match : [item.match || item.href];
  return matches.some((m) => activePath === m || activePath.startsWith(m + "/"));
}

/** Live Customer Support shell: gray bodygroup + left sidemenu + content column */
export function CsSupportLayout({ activePath, children }: CsSupportLayoutProps) {
  return (
    <main id="main-content" className="iw-cs-page pb-8 pt-2">
      <Container>
        <div id="body" className="iw-cs-body">
          <div id="bodygroup" className="iw-cs-bodygroup clearfix">
            <div id="column1" className="iw-cs-column1">
              <div id="column1content">
                <div id="sidemenu" className="alt">
                  <h5>
                    <Link href="/web/cs/customer-service">Customer Support</Link>
                  </h5>
                  <ul className="sidemenu">
                    {customerSupportNav.map((item) => {
                      const active = isActive(item, activePath);
                      return (
                        <li key={item.href} className={active ? "active" : undefined}>
                          <Link
                            href={item.href}
                            className={active ? "menuHighlight" : undefined}
                          >
                            {item.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>
            <div id="column2" className="iw-cs-column2">
              <div id="column2content" className="iw-cs-column2content">
                {children}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
