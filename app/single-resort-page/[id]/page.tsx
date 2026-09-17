import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResortDetail } from "@/components/resorts/ResortDetail";
import {
  fetchResorts,
  getResortById,
  resortDisplayName,
} from "@/lib/resort-data";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const resort = getResortById(fetchResorts(), id);
  if (!resort) return { title: "Resort Not Found" };
  return {
    title: resortDisplayName(resort),
    description: resort.location || resortDisplayName(resort),
  };
}

export default async function SingleResortPage({ params }: PageProps) {
  const { id } = await params;
  const resort = getResortById(fetchResorts(), id);
  if (!resort) notFound();

  const country = (resort.country || "").trim();
  const backHref = country
    ? `/resort-page/${encodeURIComponent(country)}`
    : "/resort-directory";

  return (
    <main id="main-content">
      <ResortDetail resort={resort} backHref={backHref} />
    </main>
  );
}
