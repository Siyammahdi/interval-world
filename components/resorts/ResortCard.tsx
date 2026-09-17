import Link from "next/link";
import type { Resort } from "@/lib/resort-types";
import { resortDisplayName } from "@/lib/resort-types";

type Props = {
  resort: Resort;
};

export function ResortCard({ resort }: Props) {
  const name = resortDisplayName(resort);
  const image = resort.img || resort.img2 || resort.img3 || "";

  return (
    <Link
      href={`/single-resort-page/${resort._id}`}
      className="block overflow-hidden rounded-xl border bg-white shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative mb-3 h-48 w-full overflow-hidden">
        {image ? (
          // External host set varies (rci.com, intervalworld.com); use img for parity
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gray-100 text-sm text-gray-400">
            No image
          </div>
        )}
      </div>
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
