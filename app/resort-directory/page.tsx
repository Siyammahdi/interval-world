import type { Metadata } from "next";
import { ResortDirectoryView } from "@/components/resorts/ResortDirectoryView";
import { fetchResorts } from "@/lib/resort-data";

export const metadata: Metadata = {
  title: "Resort Directory",
  description:
    "Browse Interval International resorts by destination — descriptions, photos, and map search.",
};

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function ResortDirectoryPage({ searchParams }: PageProps) {
  const { page: pageRaw } = await searchParams;
  const page = Number(pageRaw) || 1;
  const resorts = fetchResorts().filter((r) => r.img);

  return <ResortDirectoryView resorts={resorts} page={page} />;
}
