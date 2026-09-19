"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { AskExpert } from "@/components/home/AskExpert";
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
    <>
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-8 px-4 py-8 md:px-8 md:pb-12">
        <ResortGallery images={images} alt={name} seed={resort._id || name} />

        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-[32px] font-medium leading-[1.3] tracking-[-0.01em] text-iw-ink md:text-[42px]">
            {name}
          </h1>
          {resort.location ? (
            <p className="flex items-center gap-1 text-base text-iw-muted md:text-[20px]">
              <Image
                src="/images/figma/booking/location.svg"
                alt=""
                width={32}
                height={32}
                className="h-7 w-7 shrink-0 md:h-8 md:w-8"
              />
              <span>{resort.location}</span>
            </p>
          ) : null}
        </div>

        <div className="flex w-full max-w-[1053px] flex-col items-center gap-4">
          <div className="flex w-full max-w-[452px] gap-4 rounded-2xl bg-iw-surface p-2">
            <button
              type="button"
              className={`flex-1 rounded-lg p-2.5 text-[17px] font-medium transition-colors ${
                isExchange
                  ? "bg-iw-link text-white"
                  : "bg-white text-iw-navy hover:bg-white/90"
              }`}
              onClick={() => setVacationType("Exchange")}
            >
              Exchange(points)
            </button>
            <button
              type="button"
              className={`flex-1 rounded-lg p-2.5 text-[17px] font-medium transition-colors ${
                isGetaways
                  ? "bg-iw-link text-white"
                  : "bg-white text-iw-navy hover:bg-white/90"
              }`}
              onClick={() => setVacationType("Getaways")}
            >
              Getaways(cash)
            </button>
          </div>

          {!vacationType ? (
            <div className="w-full rounded-2xl border border-iw-border bg-iw-surface px-6 py-10 text-center">
              <p className="text-lg font-medium text-iw-navy">Select a vacation type to begin.</p>
              <p className="mt-1 text-sm text-iw-muted">
                Choose Exchange to pay with points or Getaways to pay with cash.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-hidden rounded-2xl border border-iw-border bg-white shadow-sm">
              <div
                className={`px-5 py-5 text-white md:px-8 ${
                  isExchange ? "bg-iw-navy" : "bg-iw-link"
                }`}
              >
                <h2 className="text-xl font-bold md:text-2xl">
                  {isExchange ? "Exchange Vacation (Points)" : "Getaway Vacation (Cash)"}
                </h2>
                <p className="mt-1 text-sm text-white/85">
                  {isExchange
                    ? "Book with points at our competitive rates."
                    : "Book with cash at our competitive Last Call rates."}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {(isExchange ? EXCHANGE_RATES : GETAWAY_RATES).map((rate) => (
                    <div
                      key={rate.t}
                      className="rounded-lg border border-white/20 bg-white p-2.5 text-center"
                    >
                      <p
                        className={`text-sm font-semibold ${
                          isExchange ? "text-iw-navy" : "text-iw-link"
                        }`}
                      >
                        {rate.t}
                      </p>
                      <p
                        className={`text-base font-bold ${
                          isExchange ? "text-iw-navy" : "text-iw-link"
                        }`}
                      >
                        {rate.p}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-3 text-xs text-white/80">
                  {isExchange
                    ? "* Final points will be calculated based on the total number of nights selected."
                    : "* Prices shown before tax"}
                </p>
              </div>

              <div className="space-y-4 bg-white p-5 md:p-8">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-iw-ink">
                      Earliest Travel Date
                    </label>
                    <input
                      type="date"
                      value={earliest}
                      min={minDate}
                      onChange={(e) => handleEarliestChange(e.target.value)}
                      className="h-12 w-full rounded border border-iw-border px-3 text-sm outline-none focus:border-iw-link"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-iw-ink">
                      Latest Travel Date
                    </label>
                    <input
                      type="date"
                      value={latest}
                      min={latestMin}
                      onChange={(e) => setLatest(e.target.value)}
                      className="h-12 w-full rounded border border-iw-border px-3 text-sm outline-none focus:border-iw-link"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-iw-ink">Adults</label>
                    <select
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="h-12 w-full rounded border border-iw-border px-3 text-sm outline-none focus:border-iw-link"
                    >
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-iw-ink">Children</label>
                    <select
                      value={children}
                      onChange={(e) => setChildren(Number(e.target.value))}
                      className="h-12 w-full rounded border border-iw-border px-3 text-sm outline-none focus:border-iw-link"
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
                  className={`w-full rounded-lg py-3 text-[17px] font-medium text-white transition-colors ${
                    isExchange
                      ? "bg-iw-navy hover:bg-[#0a1f45]"
                      : "bg-iw-link hover:bg-[#0a7fc0]"
                  }`}
                >
                  {isExchange
                    ? "Search Available Units (Points)"
                    : "Search Available Units (Cash)"}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-4 rounded-2xl bg-iw-surface p-2">
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
              className={`min-w-[140px] rounded-lg px-4 py-2.5 text-[17px] font-medium transition-colors md:min-w-[210px] ${
                tab === id
                  ? "bg-iw-link text-white"
                  : "bg-white text-iw-navy hover:bg-white/90"
              }`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="w-full max-w-[791px] text-iw-ink">
          {tab === "description" && (
            <p className="whitespace-pre-wrap text-sm leading-[1.7]">
              {description || "Description not available."}
            </p>
          )}

          {tab === "amenities" && (
            <div>
              <h3 className="mb-3 text-lg font-bold text-iw-navy">On-Site Amenities</h3>
              {onSite.length > 0 ? (
                <ul className="mb-4 ml-5 list-disc columns-1 gap-x-8 text-sm leading-[1.7] sm:columns-2">
                  {onSite.map((item) => (
                    <li key={item} className="mb-1 break-inside-avoid">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mb-4 text-sm text-iw-muted">Not available.</p>
              )}

              <h3 className="mb-3 mt-4 text-lg font-bold text-iw-navy">Nearby Amenities</h3>
              {nearby.length > 0 ? (
                <ul className="ml-5 list-disc columns-1 gap-x-8 text-sm leading-[1.7] sm:columns-2">
                  {nearby.map((item) => (
                    <li key={item} className="mb-1 break-inside-avoid">
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-iw-muted">Not available.</p>
              )}

              <div className="mt-5 border-y border-iw-border py-3">
                <button
                  type="button"
                  className="w-full text-left text-lg font-medium text-iw-muted"
                  onClick={() => setShowInfo((v) => !v)}
                >
                  {showInfo ? "Hide Resort Information" : "Resort Information"}
                </button>
                {showInfo ? (
                  <div className="mt-3 space-y-3 text-sm leading-[1.7]">
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
              <p className="mb-3 text-sm text-iw-muted">{resort.location || "Location unavailable"}</p>
              {resort.location ? (
                <iframe
                  title={`Map of ${name}`}
                  className="h-[320px] w-full rounded-2xl border border-iw-border"
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
          className="inline-flex items-center gap-2 text-sm font-medium text-iw-muted transition-colors hover:text-iw-link"
        >
          ← Back to Results
        </Link>
      </div>

      <AskExpert />
    </>
  );
}
