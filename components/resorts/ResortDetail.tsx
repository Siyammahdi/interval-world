"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ResortGallery } from "@/components/resorts/ResortGallery";
import {
  EXCHANGE_RATES,
  GETAWAY_RATES,
  parseAmenityList,
  resortDescription,
  resortDisplayName,
  resortImages,
  type Resort,
} from "@/lib/resort-types";

type Props = {
  resort: Resort;
  backHref: string;
};

type VacationType = "Exchange" | "Getaways" | "";
type Tab = "description" | "amenities" | "map";

function LocationPin() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-iw-blue"
      fill="currentColor"
      viewBox="0 0 20 20"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function todayInputValue() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function ResortDetail({ resort, backHref }: Props) {
  const router = useRouter();
  const [vacationType, setVacationType] = useState<VacationType>("");
  const [tab, setTab] = useState<Tab>("description");
  const [showInfo, setShowInfo] = useState(false);
  const [earliest, setEarliest] = useState("");
  const [latest, setLatest] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  const minDate = useMemo(() => todayInputValue(), []);
  const latestMin = earliest && earliest > minDate ? earliest : minDate;

  const name = resortDisplayName(resort);
  const description = resortDescription(resort);
  const images = resortImages(resort);
  const symbol = (resort.symbol || resort.resort_ID || "").trim();
  const onSite = useMemo(() => parseAmenityList(resort.onSite), [resort.onSite]);
  const nearby = useMemo(() => parseAmenityList(resort.nearby), [resort.nearby]);

  const isExchange = vacationType === "Exchange";
  const isGetaways = vacationType === "Getaways";

  function handleEarliestChange(value: string) {
    setEarliest(value);
    if (latest && value && latest < value) {
      setLatest(value);
    }
  }

  function handleSearch() {
    if (!vacationType) {
      alert("Please select Exchange or Getaways first.");
      return;
    }
    if (!earliest || !latest) {
      alert("Please select both earliest and latest travel dates.");
      return;
    }
    if (earliest < minDate || latest < minDate) {
      alert("Travel dates cannot be in the past.");
      return;
    }
    if (latest < earliest) {
      alert("Latest travel date must be on or after the earliest date.");
      return;
    }

    const params = new URLSearchParams({
      resortId: resort._id,
      earliestDate: earliest,
      latestDate: latest,
      adults: String(adults),
      children: String(children),
      vacationType,
    });
    router.push(`/available-unit?${params.toString()}`);
  }

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <ResortGallery images={images} alt={name} />

      {/* Title card — matches Netlify layout */}
      <div className="mb-6 rounded-xl border bg-white p-4 shadow-sm md:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-iw-blue md:text-3xl">{name}</h1>
            {resort.location ? (
              <p className="mt-2 flex items-start gap-1.5 text-sm text-gray-600 md:text-base">
                <LocationPin />
                <span>{resort.location}</span>
              </p>
            ) : null}
          </div>
          {symbol ? (
            <div className="shrink-0 self-start rounded-md border-2 border-iw-navy px-4 py-2 text-center">
              <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
                Symbol
              </p>
              <p className="text-lg font-bold text-iw-navy">{symbol}</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Vacation type toggle */}
      <div className="mb-4 flex justify-center">
        <button
          type="button"
          className={`rounded-l-md border-2 px-6 py-2.5 text-sm font-semibold transition-all ${
            isExchange
              ? "border-iw-navy bg-iw-navy text-white"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setVacationType("Exchange")}
        >
          Exchange <span className="text-xs opacity-75">(Points)</span>
        </button>
        <button
          type="button"
          className={`rounded-r-md border-2 border-l-0 px-6 py-2.5 text-sm font-semibold transition-all ${
            isGetaways
              ? "border-iw-blue bg-iw-blue text-white"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
          onClick={() => setVacationType("Getaways")}
        >
          Getaways <span className="text-xs">(Cash)</span>
        </button>
      </div>

      {!vacationType ? (
        <div className="mb-8 rounded-lg border bg-gray-50 p-6 text-center text-gray-600">
          <p className="font-semibold text-iw-navy">Select a vacation type to begin.</p>
          <p className="mt-1 text-sm">
            Choose Exchange to pay with points or Getaways to pay with cash.
          </p>
        </div>
      ) : (
        <div className="mb-8 rounded-lg border bg-white p-4 shadow-sm md:p-6">
          {isExchange ? (
            <div className="mb-5 rounded-lg border border-iw-navy bg-iw-navy p-4">
              <h2 className="mb-1 text-lg font-bold text-white">Exchange Vacation (Points)</h2>
              <p className="text-sm text-gray-200">Book with points at our competitive rates.</p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                {EXCHANGE_RATES.map((rate) => (
                  <div
                    key={rate.t}
                    className="rounded border border-iw-navy bg-white p-2 text-center"
                  >
                    <p className="font-semibold text-iw-navy">{rate.t}</p>
                    <p className="font-bold text-iw-navy">{rate.p}</p>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-200">
                * Final points will be calculated based on the total number of nights selected.
              </p>
            </div>
          ) : null}

          {isGetaways ? (
            <div className="mb-5 rounded-lg border border-iw-blue bg-iw-blue p-4">
              <h2 className="mb-1 text-lg font-bold text-white">Getaway Vacation (Cash)</h2>
              <p className="text-sm text-gray-200">
                Book with cash at our competitive Last Call rates.
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                {GETAWAY_RATES.map((rate) => (
                  <div
                    key={rate.t}
                    className="rounded border border-iw-blue bg-white p-2 text-center"
                  >
                    <p className="font-semibold text-iw-blue">{rate.t}</p>
                    <p className="font-bold text-iw-blue">{rate.p}</p>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-200">* Prices shown before tax</p>
            </div>
          ) : null}

          <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Earliest Travel Date
              </label>
              <input
                type="date"
                value={earliest}
                min={minDate}
                onChange={(e) => handleEarliestChange(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-iw-blue focus:ring-1 focus:ring-iw-blue"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Latest Travel Date
              </label>
              <input
                type="date"
                value={latest}
                min={latestMin}
                onChange={(e) => setLatest(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-iw-blue focus:ring-1 focus:ring-iw-blue"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Adults</label>
              <select
                value={adults}
                onChange={(e) => setAdults(Number(e.target.value))}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-iw-blue focus:ring-1 focus:ring-iw-blue"
              >
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Children</label>
              <select
                value={children}
                onChange={(e) => setChildren(Number(e.target.value))}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-iw-blue focus:ring-1 focus:ring-iw-blue"
              >
                {Array.from({ length: 11 }, (_, i) => i).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSearch}
            className={`w-full rounded-lg py-3 font-bold text-white transition-colors ${
              isExchange
                ? "bg-iw-navy hover:bg-[#0f1d35]"
                : "bg-iw-blue hover:bg-iw-blue-dark"
            }`}
          >
            {isExchange
              ? "Search Available Units (Points)"
              : "Search Available Units (Cash)"}
          </button>
        </div>
      )}

      {/* Info tabs */}
      <div className="mb-0 flex flex-wrap justify-center gap-0 md:justify-start">
        {(
          [
            ["description", "Description"],
            ["amenities", "Amenities"],
            ["map", "Map"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`border-2 border-gray-200 px-4 py-2 text-sm font-medium ${
              tab === id ? "bg-blue-500 text-white" : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="mb-6 min-h-[120px] rounded-b-lg border border-t-0 bg-white p-5 text-gray-700">
        {tab === "description" && (
          <p className="whitespace-pre-wrap leading-relaxed">
            {description || "Description not available."}
          </p>
        )}

        {tab === "amenities" && (
          <div>
            <h3 className="mb-3 text-lg font-bold text-iw-navy">On-Site Amenities</h3>
            {onSite.length > 0 ? (
              <ul className="mb-4 ml-5 list-disc columns-1 gap-x-8 sm:columns-2">
                {onSite.map((item) => (
                  <li key={item} className="mb-1 break-inside-avoid">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mb-4 text-sm text-gray-500">Not available.</p>
            )}

            <h3 className="mb-3 mt-4 text-lg font-bold text-iw-navy">Nearby Amenities</h3>
            {nearby.length > 0 ? (
              <ul className="ml-5 list-disc columns-1 gap-x-8 sm:columns-2">
                {nearby.map((item) => (
                  <li key={item} className="mb-1 break-inside-avoid">
                    {item}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Not available.</p>
            )}

            <div className="mt-5 border-y-2 py-2 hover:bg-blue-50">
              <button
                type="button"
                className="w-full text-left text-xl font-bold text-gray-500"
                onClick={() => setShowInfo((v) => !v)}
              >
                {showInfo ? "Hide Resort Information" : "Resort Information"}
              </button>
              {showInfo ? (
                <div className="mt-3 space-y-3 text-sm">
                  <div>
                    <h4 className="font-bold">Check-In Days</h4>
                    <p>
                      {resort.checkInDays && resort.checkInDays.length > 0
                        ? resort.checkInDays.join(", ")
                        : "Not available."}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-bold">Nearest Airport</h4>
                    <p>{resort.nearestAirport || "Not available."}</p>
                  </div>
                  <div>
                    <h4 className="font-bold">Contact Information</h4>
                    <p className="whitespace-pre-wrap">
                      {resort.contactInfo || "Not available."}
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {tab === "map" && (
          <div>
            <p className="mb-3 text-sm text-gray-600">
              {resort.location || "Location unavailable"}
            </p>
            {resort.location ? (
              <iframe
                title={`Map of ${name}`}
                className="h-[320px] w-full rounded-lg border"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(resort.location)}&z=12&output=embed`}
              />
            ) : (
              <p>Map not available.</p>
            )}
          </div>
        )}
      </div>

      <Link
        href={backHref}
        className="inline-flex items-center gap-2 font-bold text-gray-500 transition-colors hover:text-iw-blue"
      >
        ← Back to Results
      </Link>
    </div>
  );
}
