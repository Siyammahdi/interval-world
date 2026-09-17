"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { CheckoutStepper } from "@/components/checkout/CheckoutStepper";
import {
  buildCheckoutQuery,
  checkoutPricing,
  money,
  nightsBetween,
  type CheckoutBooking,
} from "@/lib/checkout";
import { resortDisplayName, type Resort } from "@/lib/resort-types";

type Props = {
  resort: Resort;
  booking: CheckoutBooking;
};

export function CheckoutPayment({ resort, booking }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const name = resortDisplayName(resort);
  const nights = useMemo(
    () => nightsBetween(booking.earliestDate, booking.latestDate),
    [booking.earliestDate, booking.latestDate],
  );
  const pricing = useMemo(
    () => checkoutPricing(booking.unit, nights, booking.vacationType),
    [booking.unit, booking.vacationType, nights],
  );
  const isExchange = booking.vacationType === "Exchange";
  const query = buildCheckoutQuery(booking);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    // Demo only — no payment processor
    router.push(`/checkout/confirmation?${query}`);
  }

  return (
    <div className="min-h-[70vh] bg-[#1e293b] px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-3xl">
        <CheckoutStepper current={3} />

        <div className="mb-4 rounded-2xl bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold text-gray-900">
            {isExchange ? "Confirm Points Redemption" : "Payment Details"}
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            {isExchange
              ? `Redeem points for your stay at ${name}.`
              : `Enter card details to complete your booking at ${name}.`}
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {!isExchange ? (
              <>
                <label className="block">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
                    Name on card
                  </span>
                  <input
                    required
                    name="cardName"
                    defaultValue="Ann Member"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-iw-blue"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
                    Card number
                  </span>
                  <input
                    required
                    name="cardNumber"
                    inputMode="numeric"
                    placeholder="4242 4242 4242 4242"
                    defaultValue="4242 4242 4242 4242"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-iw-blue"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
                      Expiry
                    </span>
                    <input
                      required
                      name="expiry"
                      placeholder="MM/YY"
                      defaultValue="12/28"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-iw-blue"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-bold uppercase tracking-wide text-gray-500">
                      CVC
                    </span>
                    <input
                      required
                      name="cvc"
                      inputMode="numeric"
                      placeholder="123"
                      defaultValue="123"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-iw-blue"
                    />
                  </label>
                </div>
              </>
            ) : (
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm text-gray-600">
                <p>
                  Points to redeem:{" "}
                  <span className="font-bold text-iw-navy">
                    {pricing.mode === "points" ? pricing.totalPoints.toLocaleString() : 0} pts
                  </span>
                </p>
                <p className="mt-2">This is a demo — no points balance is checked.</p>
              </div>
            )}

            <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
              <span className="text-sm text-gray-500">Amount due</span>
              <span className="text-lg font-bold text-iw-blue">
                {pricing.mode === "cash"
                  ? `$${money(pricing.totalCash)} USD`
                  : `${pricing.totalPoints.toLocaleString()} pts`}
              </span>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href={`/checkout?${query}`}
                className="text-center text-sm font-semibold text-gray-500 hover:text-iw-blue"
              >
                ← Back to Details
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-xl bg-iw-blue px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-iw-blue-dark disabled:opacity-60"
              >
                {submitting
                  ? "Processing…"
                  : isExchange
                    ? "Confirm Redemption"
                    : "Pay Now"}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-[11px] text-slate-400">Demo checkout — no real charges.</p>
      </div>
    </div>
  );
}
