"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";
import { ResortImage } from "@/components/resorts/ResortImage";
import {
  buildCheckoutQuery,
  checkoutPricing,
  formatCheckoutDate,
  money,
  nightsBetween,
  type CheckInAs,
  type CheckoutBooking,
} from "@/lib/checkout";
import { resortDisplayName, resortImages, type Resort } from "@/lib/resort-types";

type Props = {
  resort: Resort;
  booking: CheckoutBooking;
};

export function CheckoutGuestInfo({ resort, booking }: Props) {
  const router = useRouter();
  const [checkInAs, setCheckInAs] = useState<CheckInAs>(booking.checkInAs);
  const name = resortDisplayName(resort);
  const images = resortImages(resort);
  const nights = useMemo(
    () => nightsBetween(booking.earliestDate, booking.latestDate),
    [booking.earliestDate, booking.latestDate],
  );
  const pricing = useMemo(
    () => checkoutPricing(booking.unit, nights, booking.vacationType),
    [booking.unit, booking.vacationType, nights],
  );
  const isExchange = booking.vacationType === "Exchange";

  const query = buildCheckoutQuery({ ...booking, checkInAs });

  function continueToPayment() {
    router.push(`/checkout/payment?${query}`);
  }

  return (
    <div className="bg-white px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-[1200px]">
        <CheckoutStepper current={2} />

        {/* Booking type banner — Figma 97:1799 */}
        <div className="mb-8 flex items-center gap-3 rounded-lg bg-[#c9ecff] px-4 py-3.5 md:px-5">
          <div className="flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded bg-iw-navy p-2.5">
            <Image
              src="/images/figma/booking/exchange.svg"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12"
            />
          </div>
          <div>
            <p className="text-xl font-bold text-iw-navy md:text-[29px]">
              {isExchange ? "Points Exchange Booking" : "Getaway Vacation Booking"}
            </p>
            <p className="text-sm leading-[1.7] text-iw-muted">
              {isExchange
                ? "You are redeeming your Interval points for this vacation."
                : "You are paying with card for this exclusive member rate."}
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-8 overflow-hidden rounded-2xl border border-iw-border bg-white">
          <div className="flex flex-col gap-4 pr-0 sm:flex-row sm:items-center sm:pr-8">
            <div className="h-[180px] w-full shrink-0 overflow-hidden bg-iw-surface sm:h-[200px] sm:w-[300px]">
              <ResortImage
                src={images[0] || resort.img}
                fallbacks={images.slice(1)}
                alt={name}
                seed={resort._id || name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1 px-5 py-5 sm:px-0">
              <p className="text-lg text-iw-muted md:text-[20px]">
                {resort.location || name}
              </p>
              <div className="mt-6 flex flex-wrap gap-x-16 gap-y-4 text-base text-iw-ink md:text-[20px]">
                <div className="space-y-4">
                  <p>
                    <span className="text-iw-ink">Unit</span>: {booking.unit}
                  </p>
                  <p>
                    <span className="text-iw-ink">Check-in:</span>{" "}
                    <span className="text-iw-muted">
                      {formatCheckoutDate(booking.earliestDate)}
                    </span>
                  </p>
                </div>
                <div className="space-y-4 text-iw-muted">
                  <p>
                    <span className="text-iw-ink">Nights:</span> {nights}
                  </p>
                  <p>
                    <span className="text-iw-ink">Check-out:</span>{" "}
                    {formatCheckoutDate(booking.latestDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-iw-surface">
            {pricing.mode === "cash" ? (
              <>
                <div className="flex items-center justify-between border-b border-iw-border px-6 py-6 text-[20px] md:px-8">
                  <span className="text-iw-muted">
                    Base price (${money(pricing.pricePerNight)} × {nights} nights)
                  </span>
                  <span className="text-iw-ink">${money(pricing.totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between border-b border-iw-border px-6 py-6 text-[20px] md:px-8">
                  <span className="text-iw-muted">Tax &amp; Fees</span>
                  <span className="text-iw-ink">${money(pricing.tax)}</span>
                </div>
                <div className="flex items-center justify-between px-6 py-6 text-[20px] font-bold text-iw-ink md:px-8">
                  <span>Total (tax inclusive)</span>
                  <span>${money(pricing.totalCash)} USD</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between border-b border-iw-border px-6 py-6 text-[20px] md:px-8">
                  <span className="text-iw-muted">
                    Base points ({pricing.pointsPerNight.toLocaleString()} × {nights} nights)
                  </span>
                  <span className="text-iw-ink">
                    {pricing.totalPoints.toLocaleString()} pts
                  </span>
                </div>
                <div className="flex items-center justify-between px-6 pb-8 pt-4 text-[20px] font-bold text-iw-ink md:px-8">
                  <span>Total Points</span>
                  <span>{pricing.totalPoints.toLocaleString()} pts</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Who's checking in */}
        <div className="mb-8 rounded-lg border border-iw-border bg-white p-6 md:p-8">
          <h3 className="mb-6 text-2xl font-medium text-iw-ink md:text-[29px]">
            Who&apos;s Checking In?
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setCheckInAs("member")}
              className={`flex items-center justify-center gap-2.5 rounded-lg px-[42px] py-3.5 text-[17px] font-medium transition-colors ${
                checkInAs === "member"
                  ? "bg-iw-navy text-white"
                  : "border border-iw-muted bg-white text-iw-ink hover:bg-iw-surface"
              }`}
            >
              Member
            </button>
            <button
              type="button"
              onClick={() => setCheckInAs("guest")}
              className={`flex items-center justify-center gap-2.5 rounded-lg px-[42px] py-3.5 text-[17px] font-medium transition-colors ${
                checkInAs === "guest"
                  ? "bg-iw-navy text-white"
                  : "border border-iw-muted bg-white text-iw-ink hover:bg-iw-surface"
              }`}
            >
              Guest
            </button>
          </div>
          <p className="mt-6 text-sm leading-[1.7] text-iw-ink">
            {checkInAs === "member"
              ? "You (the member) will check in for this vacation."
              : "A guest will check in for this vacation under your membership."}
          </p>
        </div>

        {/* Action bar */}
        <div className="flex flex-col gap-4 rounded-lg border border-iw-border bg-white px-6 py-4 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <div>
            <p className="text-[10px] font-medium text-iw-ink">Total amount</p>
            <p className="flex items-baseline gap-2 text-[35px] font-bold leading-none text-iw-ink">
              {pricing.mode === "cash" ? (
                <>
                  ${money(pricing.totalCash)}
                  <span className="text-sm font-normal">USD</span>
                </>
              ) : (
                <>
                  {pricing.totalPoints.toLocaleString()}
                  <span className="text-sm font-normal">points</span>
                </>
              )}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={`/available-unit?${new URLSearchParams({
                resortId: booking.resortId,
                earliestDate: booking.earliestDate,
                latestDate: booking.latestDate,
                adults: String(booking.adults),
                children: String(booking.children),
                vacationType: booking.vacationType,
              }).toString()}`}
              className="text-center text-sm font-medium text-iw-muted hover:text-iw-link"
            >
              ← Back
            </Link>
            <button
              type="button"
              onClick={continueToPayment}
              className="rounded-lg bg-iw-navy px-10 py-3.5 text-[17px] font-medium text-white transition-colors hover:bg-[#0a1f45]"
            >
              {isExchange ? "Continue to Confirm" : "Continue to Payment"}
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-iw-muted">
          Demo checkout — no real charges.
        </p>
      </div>
    </div>
  );
}
