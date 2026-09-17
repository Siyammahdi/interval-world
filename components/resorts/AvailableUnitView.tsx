"use client";

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
};

function LocationPin() {
  return (
    <svg className="mt-0.5 h-4 w-4 shrink-0 text-iw-blue" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
      <path
        fillRule="evenodd"
        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export function AvailableUnitView({ resort, search }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<AvailableUnitType | null>(null);
  const isExchange = search.vacationType === "Exchange";
  const name = resortDisplayName(resort);
  const symbol = (resort.symbol || resort.resort_ID || "").trim();
  const images = resortImages(resort);
  const nights = useMemo(
    () => nightsBetween(search.earliestDate, search.latestDate),
    [search.earliestDate, search.latestDate],
  );
  const guests = search.adults + search.children;
  const usageYear = useMemo(() => {
    const d = new Date(search.earliestDate);
    return Number.isNaN(d.getTime()) ? new Date().getFullYear() : d.getFullYear();
  }, [search.earliestDate]);

  function handleSelectUnit(unit: AvailableUnitType) {
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
    router.push(`/checkout?${params.toString()}`);
  }

  return (
    <div className="min-h-[70vh] bg-[#1e293b] py-6 md:py-10">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Banner */}
        <div
          className={`flex items-center gap-4 px-6 py-6 text-white sm:px-8 ${
            isExchange ? "bg-iw-navy" : "bg-iw-blue"
          }`}
        >
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/15">
            {isExchange ? (
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
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
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {isExchange ? "Points Exchange" : "Getaway Vacation"}
            </h1>
            <p className="text-sm font-medium opacity-90">
              {isExchange
                ? "Redeem your Interval points for this exclusive stay"
                : "Book with our competitive member rates"}
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-8">
          {/* Reservation details */}
          <div className="mb-8 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-gray-800">Reservation Details</h2>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold uppercase text-iw-blue">
                Confirmed Availability
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Check-in</p>
                <p className="mt-1 font-bold text-gray-800">
                  {formatReservationDate(search.earliestDate)}
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Check-out</p>
                <p className="mt-1 font-bold text-gray-800">
                  {formatReservationDate(search.latestDate)}
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Duration</p>
                <p className="mt-1 font-bold text-gray-800">{nights} Nights</p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50/80 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Occupancy</p>
                <p className="mt-1 font-bold text-gray-800">{guests} Guests</p>
              </div>
            </div>
          </div>

          {/* Resort card */}
          <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex flex-col sm:flex-row">
              <div className="h-48 w-full shrink-0 overflow-hidden bg-gray-200 sm:h-auto sm:min-h-[14rem] sm:w-56">
                <ResortImage
                  src={images[0] || resort.img}
                  fallbacks={images.slice(1)}
                  alt={name}
                  seed={resort._id || name}
                  className="h-48 w-full sm:min-h-[14rem] sm:h-full"
                />
              </div>
              <div className="relative flex flex-grow flex-col justify-center p-6">
                {symbol ? (
                  <span className="absolute right-4 top-4 rounded bg-iw-navy px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    {symbol}
                  </span>
                ) : null}
                <h3 className="pr-16 text-xl font-bold text-gray-900">{name}</h3>
                {resort.location ? (
                  <p className="mt-2 flex items-start gap-1.5 text-sm text-gray-600">
                    <LocationPin />
                    <span>{resort.location}</span>
                  </p>
                ) : null}
              </div>
            </div>
          </div>

          {/* Units */}
          <h2 className="mb-6 flex items-center gap-2 text-xl font-bold text-gray-800">
            <span className="h-6 w-1.5 rounded-full bg-iw-blue" />
            Select Available Unit
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {AVAILABLE_UNIT_TYPES.map((unit) => {
              const cash = unitCashQuote(unit, nights);
              const points = unitPointsQuote(unit, nights);
              const isSelected = selected === unit;
              const ring = isExchange
                ? "border-iw-navy ring-4 ring-[#18294B]/50"
                : "border-iw-blue ring-4 ring-[#0077be]/50";

              return (
                <div
                  key={unit}
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelected(unit)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setSelected(unit);
                  }}
                  className={`group cursor-pointer overflow-hidden rounded-2xl border-2 bg-white shadow-md transition-all duration-300 hover:shadow-xl ${
                    isSelected ? ring : "border-white hover:border-gray-200"
                  }`}
                >
                  <div
                    className={`px-4 py-4 text-center text-sm font-bold uppercase tracking-wide text-white transition-colors group-hover:opacity-90 ${
                      isExchange ? "bg-iw-navy" : "bg-iw-blue"
                    }`}
                  >
                    {unit}
                  </div>
                  <div className="bg-white p-6">
                    <div className="mb-6 text-center">
                      {isExchange ? (
                        <>
                          <p className="text-3xl font-black text-iw-navy">
                            {points.totalPoints.toLocaleString()}
                          </p>
                          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            total points
                          </p>
                          <div className="mt-4 rounded-lg border border-gray-100 bg-gray-50 p-3 text-[11px] text-gray-500">
                            <span className="font-bold text-iw-navy">
                              {points.pointsPerNight.toLocaleString()}
                            </span>{" "}
                            pts/night x {nights} nights
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-3xl font-black text-iw-blue">
                            ${cash.totalPrice.toLocaleString()}
                          </p>
                          <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                            total price
                          </p>
                          <div className="mt-4 rounded-lg border border-gray-100 bg-blue-50/60 p-3 text-[11px] text-gray-500">
                            <span className="font-bold text-iw-blue">
                              ${cash.pricePerNight.toLocaleString()}
                            </span>
                            /night x {nights} nights
                          </div>
                        </>
                      )}
                    </div>

                    <div className="mb-5 space-y-2 text-[11px] text-gray-600">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>
                          Status:{" "}
                          <span className="font-bold text-green-600">Immediate Confirmation</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Unit: Full Kitchen Facilities</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span>Usage Year: {usageYear}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`w-full rounded-xl py-3 text-xs font-black uppercase tracking-widest text-white shadow-sm transition-all hover:shadow-md ${
                        isExchange
                          ? "bg-iw-navy hover:bg-[#0f1d35]"
                          : "bg-iw-blue hover:bg-[#005a8e]"
                      }`}
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

          <div className="mt-8">
            <Link
              href={`/single-resort-page/${resort._id}`}
              className="inline-flex items-center gap-2 font-bold text-gray-500 transition-colors hover:text-iw-blue"
            >
              ← Back to Resort
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
