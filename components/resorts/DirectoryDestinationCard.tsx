import Image from "next/image";
import Link from "next/link";
import { ResortImage } from "@/components/resorts/ResortImage";
import type { Resort } from "@/lib/resort-types";
import { resortDisplayName, resortImages } from "@/lib/resort-types";

type Props = {
  resort: Resort;
};

/** Figma Popular Destination / Result card */
export function DirectoryDestinationCard({ resort }: Props) {
  const name = resortDisplayName(resort);
  const images = resortImages(resort);
  const location = resort.location || resort.country || "Location unavailable";

  return (
    <Link
      href={`/single-resort-page/${resort._id}`}
      className="flex w-full flex-col gap-4 rounded-2xl border border-iw-border bg-white p-4 shadow-[9px_16px_15px_rgba(161,161,161,0.2)] transition-shadow hover:shadow-lg"
    >
      <div className="relative h-[200px] w-full overflow-hidden rounded-lg">
        <ResortImage
          src={images[0]}
          fallbacks={images.slice(1)}
          alt={name}
          seed={resort._id || name}
          className="h-full w-full"
        />
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <p className="truncate text-[17px] font-medium text-iw-ink md:text-[20px]">{name}</p>
        <div className="flex items-center gap-1 text-iw-muted">
          <Image
            src="/images/figma/directory/location.svg"
            alt=""
            width={24}
            height={24}
            className="size-5 shrink-0 md:size-6"
            aria-hidden
          />
          <p className="truncate text-[14px] leading-[1.7]">{location}</p>
        </div>
      </div>
    </Link>
  );
}
