import Link from "next/link";
import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";
import { ResortImage } from "@/components/resorts/ResortImage";
import {
  checkoutPricing,
  formatCheckoutDate,
  money,
  nightsBetween,
  type CheckoutBooking,
} from "@/lib/checkout";
import { resortDisplayName, resortImages, type Resort } from "@/lib/resort-types";

type Props = {
  resort: Resort;
  booking: CheckoutBooking;
};

function demoConfirmationCode(booking: CheckoutBooking): string {
  const seed = `${booking.resortId}-${booking.unit}-${booking.earliestDate}`.replace(/\W/g, "");
  return `IW${seed.slice(-8).toUpperCase()}`;
}

export function CheckoutConfirmation({ resort, booking }: Props) {
  const name = resortDisplayName(resort);
  const images = resortImages(resort);
  const nights = nightsBetween(booking.earliestDate, booking.latestDate);
  const pricing = checkoutPricing(booking.unit, nights, booking.vacationType);
  const code = demoConfirmationCode(booking);
  const isExchange = booking.vacationType === "Exchange";

  return (
    <div className="bg-white px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-[800px]">
        <CheckoutStepper current={4} />

        <div className="mb-4 overflow-hidden rounded-2xl border border-iw-border bg-white">
          <div className="bg-[#e8f7ee] px-5 py-8 text-center sm:px-8">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#22a35a] text-white">
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-medium text-iw-ink md:text-[29px]">Booking Confirmed</h2>
            <p className="mt-1 text-sm text-iw-muted">
              Confirmation <span className="font-bold text-iw-navy">{code}</span>
            </p>
            <p className="mt-2 text-xs text-iw-muted">Demo reservation — nothing was charged.</p>
          </div>

          <div className="flex flex-col gap-4 border-t border-iw-border p-5 sm:flex-row sm:items-start md:p-8">
            <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-iw-surface sm:w-36">
              <ResortImage
                src={images[0] || resort.img}
                fallbacks={images.slice(1)}
                alt={name}
                seed={resort._id || name}
                className="h-28 w-full object-cover sm:w-36"
              />
            </div>
            <div className="min-w-0 flex-1 text-sm text-iw-ink">
              <h3 className="text-lg font-medium text-iw-ink md:text-xl">{name}</h3>
              {resort.location ? <p className="text-iw-muted">{resort.location}</p> : null}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <p>
                  <span className="font-semibold">Unit:</span> {booking.unit}
                </p>
                <p>
                  <span className="font-semibold">Nights:</span> {nights}
                </p>
                <p>
                  <span className="font-semibold">Check-in:</span>{" "}
                  {formatCheckoutDate(booking.earliestDate)}
                </p>
                <p>
                  <span className="font-semibold">Check-out:</span>{" "}
                  {formatCheckoutDate(booking.latestDate)}
                </p>
                <p>
                  <span className="font-semibold">Check-in as:</span>{" "}
                  {booking.checkInAs === "member" ? "Member" : "Guest"}
                </p>
                <p>
                  <span className="font-semibold">Type:</span>{" "}
                  {isExchange ? "Points Exchange" : "Getaway"}
                </p>
              </div>
              <p className="mt-4 text-base font-bold text-iw-navy">
                {pricing.mode === "cash"
                  ? `Total paid: $${money(pricing.totalCash)} USD`
                  : `Points redeemed: ${pricing.totalPoints.toLocaleString()} pts`}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/single-resort-page/${resort._id}`}
            className="rounded-lg bg-iw-navy px-6 py-3.5 text-center text-[17px] font-medium text-white hover:bg-[#0a1f45]"
          >
            Back to Resort
          </Link>
          <Link
            href="/resort-directory"
            className="rounded-lg border border-iw-border px-6 py-3.5 text-center text-[17px] font-medium text-iw-ink hover:bg-iw-surface"
          >
            Browse Directory
          </Link>
        </div>
      </div>
    </div>
  );
}
