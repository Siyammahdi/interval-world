import Link from "next/link";
import { ResortImage } from "@/components/resorts/ResortImage";
import type { Resort } from "@/lib/resort-types";
import { resortDisplayName, resortImages } from "@/lib/resort-types";

type Props = {
  resort: Resort;
};

export function ResortCard({ resort }: Props) {
  const name = resortDisplayName(resort);
  const images = resortImages(resort);

  return (
    <Link
      href={`/single-resort-page/${resort._id}`}
      className="block overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <ResortImage
        src={images[0]}
        fallbacks={images.slice(1)}
        alt={name}
        seed={resort._id || name}
        className="mb-3 h-48 w-full"
      />
      <div className="px-4 pb-4">
        <p className="mb-2 text-sm font-medium text-[#5a7a9a]">
          {resort.location || "Location unavailable"}
        </p>
        <p className="mb-3 text-base font-semibold text-iw-navy">{name}</p>
        <span
          className="inline-block h-4 w-4 rounded border border-gray-300 bg-white"
          aria-hidden
        />
      </div>
    </Link>
  );
}
