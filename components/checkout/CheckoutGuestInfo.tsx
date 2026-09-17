"use client";

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
    <div className="min-h-[70vh] bg-[#1e293b] px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-3xl">
        <CheckoutStepper current={2} />

        {/* Booking type banner */}
        <div className="mb-4 flex items-start gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-iw-blue">
            {isExchange ? (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V5a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            )}
          </div>
          <div>
            <p className="text-base font-bold text-gray-900">
              {isExchange ? "Points Exchange Booking" : "Getaway Vacation Booking"}
            </p>
            <p className="text-sm text-gray-500">
              {isExchange
                ? "You are redeeming Interval points for this exclusive stay."
                : "You are paying with card for this exclusive member rate."}
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="mb-4 overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start">
            <div className="h-28 w-full shrink-0 overflow-hidden rounded-xl bg-gray-100 sm:h-28 sm:w-36">
              <ResortImage
                src={images[0] || resort.img}
                fallbacks={images.slice(1)}
                alt={name}
                seed={resort._id || name}
                className="h-28 w-full sm:w-36"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-bold text-gray-900">{name}</h2>
              {resort.location ? (
                <p className="mt-1 text-sm text-gray-500">{resort.location}</p>
              ) : null}
              <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-700">
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
              </div>
            </div>
          </div>

          <div className="space-y-2 border-t border-gray-100 bg-gray-50 px-5 py-4 text-sm">
            {pricing.mode === "cash" ? (
              <>
                <div className="flex items-center justify-between text-gray-600">
                  <span>
                    Base price (${money(pricing.pricePerNight)} × {nights} nights)
                  </span>
                  <span>${money(pricing.totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between text-gray-600">
                  <span>Tax &amp; Fees</span>
                  <span>${money(pricing.tax)}</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-base font-bold text-iw-blue">
                  <span>Total (tax inclusive)</span>
                  <span>${money(pricing.totalCash)} USD</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between text-gray-600">
                  <span>
                    Points ({pricing.pointsPerNight.toLocaleString()} × {nights} nights)
                  </span>
                  <span>{pricing.totalPoints.toLocaleString()} pts</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-base font-bold text-iw-navy">
                  <span>Total points</span>
                  <span>{pricing.totalPoints.toLocaleString()} pts</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Who's checking in */}
        <div className="mb-4 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <h3 className="mb-4 text-lg font-bold text-gray-900">Who&apos;s Checking In?</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setCheckInAs("member")}
              className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-4 text-base font-semibold transition-colors ${
                checkInAs === "member"
                  ? "border-iw-blue bg-iw-blue text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
              Member
            </button>
            <button
              type="button"
              onClick={() => setCheckInAs("guest")}
              className={`flex items-center justify-center gap-2 rounded-xl border-2 px-4 py-4 text-base font-semibold transition-colors ${
                checkInAs === "guest"
                  ? "border-iw-blue bg-iw-blue text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              <svg
                className={`h-5 w-5 ${checkInAs === "guest" ? "text-white" : "text-orange-500"}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden
              >
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              Guest
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-500">
            {checkInAs === "member"
              ? "You (the member) will check in for this vacation."
              : "A guest will check in for this vacation under your membership."}
          </p>
        </div>

        {/* Action bar */}
        <div className="flex flex-col gap-4 rounded-2xl bg-white px-5 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">Total amount</p>
            <p className="text-xl font-bold text-gray-900">
              {pricing.mode === "cash"
                ? `$${money(pricing.totalCash)} USD`
                : `${pricing.totalPoints.toLocaleString()} pts`}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Link
              href={`/available-unit?${new URLSearchParams({
                resortId: booking.resortId,
                earliestDate: booking.earliestDate,
                latestDate: booking.latestDate,
                adults: String(booking.adults),
                children: String(booking.children),
                vacationType: booking.vacationType,
              }).toString()}`}
              className="text-center text-sm font-semibold text-gray-500 hover:text-iw-blue"
            >
              ← Back
            </Link>
            <button
              type="button"
              onClick={continueToPayment}
              className="rounded-xl bg-iw-blue px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-iw-blue-dark"
            >
              {isExchange ? "Continue to Confirm" : "Continue to Payment"}
            </button>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] text-slate-400">Demo checkout — no real charges.</p>
      </div>
    </div>
  );
}
