import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutConfirmation } from "@/components/checkout/CheckoutConfirmation";
import { parseCheckoutSearchParams } from "@/lib/checkout";
import { fetchResorts, getResortById, resortDisplayName } from "@/lib/resort-data";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const booking = parseCheckoutSearchParams(await searchParams);
  const resort = booking ? getResortById(fetchResorts(), booking.resortId) : null;
  return {
    title: resort ? `Confirmation — ${resortDisplayName(resort)}` : "Confirmation",
  };
}

export default async function CheckoutConfirmationPage({ searchParams }: PageProps) {
  const booking = parseCheckoutSearchParams(await searchParams);
  const resort = booking ? getResortById(fetchResorts(), booking.resortId) : null;

  if (!booking || !resort) {
    return (
      <main id="main-content" className="mx-auto max-w-xl p-8 text-center">
        <p className="mb-4 font-medium text-red-500">
          Missing booking data. Please select a unit again.
        </p>
        <Link href="/resort-directory" className="font-bold text-iw-blue hover:underline">
          Return to Resort Directory
        </Link>
      </main>
    );
  }

  return (
    <main id="main-content">
      <CheckoutConfirmation resort={resort} booking={booking} />
    </main>
  );
}
