import type { Metadata } from "next";
import Link from "next/link";
import { AvailableUnitView } from "@/components/resorts/AvailableUnitView";
import { fetchResorts, getResortById, resortDisplayName } from "@/lib/resort-data";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function first(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const sp = await searchParams;
  const resort = getResortById(fetchResorts(), first(sp.resortId));
  return {
    title: resort ? `Available Units — ${resortDisplayName(resort)}` : "Available Units",
  };
}

export default async function AvailableUnitPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const resortId = first(sp.resortId);
  const earliestDate = first(sp.earliestDate);
  const latestDate = first(sp.latestDate);
  const adults = Math.max(1, Number(first(sp.adults) || 1) || 1);
  const children = Math.max(0, Number(first(sp.children) || 0) || 0);
  const vacationTypeRaw = first(sp.vacationType);
  const vacationType = vacationTypeRaw === "Exchange" ? "Exchange" : "Getaways";

  const resort = getResortById(fetchResorts(), resortId);

  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const hasPastDates =
    Boolean(earliestDate && earliestDate < todayIso) ||
    Boolean(latestDate && latestDate < todayIso);

  if (!resort || !earliestDate || !latestDate || hasPastDates) {
    return (
      <main id="main-content" className="mx-auto max-w-xl p-8 text-center">
        <p className="mb-4 font-medium text-red-500">
          {hasPastDates
            ? "Travel dates cannot be in the past. Please choose new dates."
            : "Error: Missing booking data. Please go back and try again."}
        </p>
        <Link
          href={resort ? `/single-resort-page/${resort._id}` : "/resort-directory"}
          className="font-bold text-iw-blue hover:underline"
        >
          {resort ? "Back to Resort" : "Return to Resort Directory"}
        </Link>
      </main>
    );
  }

  return (
    <main id="main-content">
      <AvailableUnitView
        resort={resort}
        search={{
          earliestDate,
          latestDate,
          adults,
          children,
          vacationType,
        }}
      />
    </main>
  );
}
