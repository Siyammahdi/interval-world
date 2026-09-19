import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Interval International | Home",
    template: "%s | Interval International",
  },
  description:
    "Interval International vacation ownership exchange — explore resorts, Getaways, and member benefits.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${poppins.variable} h-full`}>
      <body className="min-h-full bg-white font-sans text-iw-ink antialiased">
        <AppShell
          header={<SiteHeader />}
          footer={<SiteFooter />}
          banner={<CookieBanner />}
        >
          {children}
        </AppShell>
      </body>
    </html>
  );
}
