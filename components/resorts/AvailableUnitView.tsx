"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ResortImage } from "@/components/resorts/ResortImage";
import {
  AVAILABLE_UNIT_TYPES,
  formatReservationDate,
  nightsBetween,
  unitCashQuote,
  unitPointsQuote,
  type AvailableUnitType,
} from "@/lib/available-units";
import { createCheckoutSession } from "@/app/actions/api";
import type { UnitRate } from "@/lib/cms";
import {
  resortDisplayName,
  resortImages,
  type Resort,
} from "@/lib/resort-types";

export type AvailableUnitSearch = {
  earliestDate: string;
  latestDate: string;
  adults: number;
  children: number;
  vacationType: "Exchange" | "Getaways";
};

type Props = {
  resort: Resort;
  search: AvailableUnitSearch;
  unitRates: UnitRate[];
};

export function AvailableUnitView({ resort, search, unitRates }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<AvailableUnitType | null>(null);
  const isExchange = search.vacationType === "Exchange";
  const name = resortDisplayName(resort);
  const images = resortImages(resort);
  const nights = useMemo(
    () => nightsBetween(search.earliestDate, search.latestDate),
    [search.earliestDate, search.latestDate],
  );
  const unitTypes = useMemo(
    () =>
      (unitRates.length
        ? unitRates.map((r) => r.unit_type)
        : [...AVAILABLE_UNIT_TYPES]) as AvailableUnitType[],
    [unitRates],
  );
  const guests = search.adults + search.children;
  const usageYear = useMemo(() => {
    const d = new Date(search.earliestDate);
    return Number.isNaN(d.getTime()) ? new Date().getFullYear() : d.getFullYear();
  }, [search.earliestDate]);

  async function handleSelectUnit(unit: AvailableUnitType) {
    setSelected(unit);
    const params = new URLSearchParams({
      resortId: resort._id,
      unit,
      earliestDate: search.earliestDate,
      latestDate: search.latestDate,
      adults: String(search.adults),
      children: String(search.children),
      vacationType: search.vacationType,
      checkInAs: "member",
    });
    try {
      const session = await createCheckoutSession({
        resortId: resort._id,
        unit,
        earliestDate: search.earliestDate,
        latestDate: search.latestDate,
        adults: search.adults,
        children: search.children,
        vacationType: search.vacationType,
        checkInAs: "member",
      });
      params.set("sessionId", session.id);
    } catch {
      // Fall back to URL-only checkout if API is unavailable
    }
    router.push(`/checkout?${params.toString()}`);
  }

  return (
    <div className="bg-white px-4 py-8 md:px-8 md:py-10">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-8">
        {/* Banner — Figma 95:1230 */}
        <div
          className={`flex items-center gap-3 rounded-lg px-4 py-3.5 text-white md:px-5 ${
            isExchange ? "bg-iw-navy" : "bg-iw-link"
          }`}
        >
          <div
            className={`flex h-[68px] w-[68px] shrink-0 items-center justify-center rounded p-2.5 ${
              isExchange ? "bg-iw-blue" : "bg-iw-navy"
            }`}
          >
            <Image
              src="/images/figma/booking/exchange.svg"
              alt=""
              width={48}
              height={48}
              className="h-12 w-12"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold md:text-[29px]">
              {isExchange ? "Points Exchange" : "Getaway Vacation"}
            </h1>
            <p className="text-sm leading-[1.7] text-white/90">
              {isExchange
                ? "Redeem your Interval points for this exclusive stay"
                : "Book with our competitive member rates"}
            </p>
          </div>
        </div>

        {/* Reservation details */}
        <div className="rounded-lg border border-iw-border bg-white p-6 md:p-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-medium text-iw-ink md:text-[29px]">
              Reservation Details
            </h2>
            <span className="rounded-[18px] bg-[#c9ecff] px-3 py-1 text-xs font-medium tracking-wide text-iw-navy">
              Confirmed Availability
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[
              ["Check-in", formatReservationDate(search.earliestDate)],
              ["Check-out", formatReservationDate(search.latestDate)],
              ["Duration", `${nights} Nights`],
              ["Occupancy", `${guests} Guests`],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-lg border border-iw-surface bg-iw-surface px-4 py-4"
              >
                <p className="text-[10px] font-medium text-iw-muted">{label}</p>
                <p className="mt-0.5 text-sm font-medium leading-[1.6] text-iw-ink">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Resort card */}
        <div className="overflow-hidden rounded-lg border border-iw-border bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center">
            <div className="h-[180px] w-full shrink-0 overflow-hidden bg-iw-surface sm:h-[200px] sm:w-[300px]">
              <ResortImage
                src={images[0] || resort.img}
                fallbacks={images.slice(1)}
                alt={name}
                seed={resort._id || name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 items-center gap-1 px-5 py-5">
              <Image
                src="/images/figma/booking/location.svg"
                alt=""
                width={32}
                height={32}
                className="h-8 w-8 shrink-0"
              />
              <div>
                <p className="text-lg font-medium text-iw-ink md:text-xl">{name}</p>
                {resort.location ? (
                  <p className="text-base text-iw-muted md:text-[20px]">{resort.location}</p>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Units */}
        <div>
          <h2 className="mb-8 text-2xl font-medium text-iw-ink md:text-[29px]">
            Select Available Unit
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {unitTypes.map((unit) => {
              const cash = unitCashQuote(unit, nights, unitRates);
              const points = unitPointsQuote(unit, nights, unitRates);
              const isSelected = selected === unit;

              return (
                <div
                  key={unit}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelected(unit)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSelected(unit);
                  }}
                  className={`overflow-hidden rounded-3xl border bg-white transition-shadow hover:shadow-md ${
                    isSelected ? "border-iw-link shadow-md" : "border-iw-border"
                  }`}
                >
                  <div className="flex h-14 items-center justify-center bg-iw-ink px-4">
                    <p className="text-center text-xl font-medium text-white md:text-2xl">
                      {unit}
                    </p>
                  </div>
                  <div className="flex flex-col items-center gap-8 px-6 py-8">
                    <div className="flex w-full flex-col items-center gap-4">
                      {isExchange ? (
                        <>
                          <div className="text-center">
                            <p className="text-[35px] font-bold leading-none text-iw-ink">
                              {points.totalPoints.toLocaleString()}
                            </p>
                            <p className="mt-1 text-sm font-medium text-iw-muted">Total points</p>
                          </div>
                          <div className="w-full rounded-lg bg-iw-surface px-4 py-3.5 text-center text-sm font-medium text-iw-ink">
                            {points.pointsPerNight.toLocaleString()} pts/night × {nights} nights
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-center">
                            <p className="text-[35px] font-bold leading-none text-iw-ink">
                              ${cash.totalPrice.toLocaleString()}
                            </p>
                            <p className="mt-1 text-sm font-medium text-iw-muted">Total price</p>
                          </div>
                          <div className="w-full rounded-lg bg-iw-surface px-4 py-3.5 text-center text-sm font-medium text-iw-ink">
                            ${cash.pricePerNight.toLocaleString()}/night × {nights} nights
                          </div>
                        </>
                      )}
                    </div>

                    <div className="w-full space-y-3 text-sm text-iw-ink">
                      <p>
                        Status:{" "}
                        <span className="font-bold tracking-wide text-iw-link">
                          Immediate Confirmation
                        </span>
                      </p>
                      <p>Unit: Full Kitchen Facilities</p>
                      <p>Usage Year: {usageYear}</p>
                    </div>

                    <button
                      type="button"
                      className="w-full rounded-lg bg-iw-link py-2.5 text-[17px] font-medium text-white transition-colors hover:bg-[#0a7fc0]"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectUnit(unit);
                      }}
                    >
                      Select Unit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <Link
          href={`/single-resort-page/${resort._id}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-iw-muted transition-colors hover:text-iw-link"
        >
          ← Back to Resort
        </Link>
      </div>
    </div>
  );
}
