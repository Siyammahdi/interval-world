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
    router.push(`/checkout/confirmation?${query}`);
  }

  return (
    <div className="bg-white px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-[800px]">
        <CheckoutStepper current={3} />

        <div className="mb-4 rounded-2xl border border-iw-border bg-white p-6 md:p-8">
          <h2 className="text-2xl font-medium text-iw-ink md:text-[29px]">
            {isExchange ? "Confirm Points Redemption" : "Payment Details"}
          </h2>
          <p className="mt-1 text-sm leading-[1.7] text-iw-muted">
            {isExchange
              ? `Redeem points for your stay at ${name}.`
              : `Enter card details to complete your booking at ${name}.`}
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {!isExchange ? (
              <>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-iw-ink">Name on card</span>
                  <input
                    required
                    name="cardName"
                    defaultValue="Ann Member"
                    className="h-12 w-full rounded border border-iw-border px-4 text-sm outline-none focus:border-iw-link"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-iw-ink">Card number</span>
                  <input
                    required
                    name="cardNumber"
                    inputMode="numeric"
                    placeholder="4242 4242 4242 4242"
                    defaultValue="4242 4242 4242 4242"
                    className="h-12 w-full rounded border border-iw-border px-4 text-sm outline-none focus:border-iw-link"
                  />
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-iw-ink">Expiry</span>
                    <input
                      required
                      name="expiry"
                      placeholder="MM/YY"
                      defaultValue="12/28"
                      className="h-12 w-full rounded border border-iw-border px-4 text-sm outline-none focus:border-iw-link"
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-sm font-medium text-iw-ink">CVC</span>
                    <input
                      required
                      name="cvc"
                      inputMode="numeric"
                      placeholder="123"
                      defaultValue="123"
                      className="h-12 w-full rounded border border-iw-border px-4 text-sm outline-none focus:border-iw-link"
                    />
                  </label>
                </div>
              </>
            ) : (
              <div className="rounded-lg border border-iw-border bg-iw-surface p-4 text-sm text-iw-muted">
                <p>
                  Points to redeem:{" "}
                  <span className="font-bold text-iw-navy">
                    {pricing.mode === "points" ? pricing.totalPoints.toLocaleString() : 0} pts
                  </span>
                </p>
                <p className="mt-2">This is a demo — no points balance is checked.</p>
              </div>
            )}

            <div className="flex items-center justify-between rounded-lg bg-iw-surface px-4 py-3">
              <span className="text-sm text-iw-muted">Amount due</span>
              <span className="text-lg font-bold text-iw-ink">
                {pricing.mode === "cash"
                  ? `$${money(pricing.totalCash)} USD`
                  : `${pricing.totalPoints.toLocaleString()} pts`}
              </span>
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
              <Link
                href={`/checkout?${query}`}
                className="text-center text-sm font-medium text-iw-muted hover:text-iw-link"
              >
                ← Back to Details
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-iw-navy px-8 py-3.5 text-[17px] font-medium text-white transition-colors hover:bg-[#0a1f45] disabled:opacity-60"
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

        <p className="text-center text-[11px] text-iw-muted">Demo checkout — no real charges.</p>
      </div>
    </div>
  );
}
