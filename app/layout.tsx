import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
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
    <html lang="en" className={`${roboto.variable} h-full`}>
      <body className="min-h-full bg-white font-sans text-iw-navy antialiased">
        {/* Centered page shell matching live ~1148px canvas */}
        <div className="mx-auto min-h-full w-full max-w-[1148px] bg-white ">
          <SiteHeader />
          {children}
          <SiteFooter />
        </div>
        <CookieBanner />
      </body>
    </html>
  );
}
