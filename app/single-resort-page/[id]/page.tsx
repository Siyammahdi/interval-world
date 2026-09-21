import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResortDetail } from "@/components/resorts/ResortDetail";
import { fetchUnitRates } from "@/lib/cms";
import {
  fetchResortById,
  resortDisplayName,
} from "@/lib/resort-data";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const resort = await fetchResortById(id);
  if (!resort) return { title: "Resort Not Found" };
  return {
    title: resortDisplayName(resort),
    description: resort.location || resortDisplayName(resort),
  };
}

export default async function SingleResortPage({ params }: PageProps) {
  const { id } = await params;
  const [resort, unitRates] = await Promise.all([fetchResortById(id), fetchUnitRates()]);
  if (!resort) notFound();

  const country = (resort.country || "").trim();
  const backHref = country
    ? `/resort-page/${encodeURIComponent(country)}`
    : "/resort-directory";

  return (
    <main id="main-content">
      <ResortDetail resort={resort} backHref={backHref} unitRates={unitRates} />
    </main>
  );
}
