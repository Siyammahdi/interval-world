import Image from "next/image";
import Link from "next/link";
import { DIRECTORY_MAP_GROUPS } from "@/data/directory-map";
import type { DirectoryMeta } from "@/lib/cms";

type Props = {
  regions: DirectoryMeta["mapSearchRegions"];
  className?: string;
};

const countryRegionPaths: Record<string, string> = {
  Australia: "Australia",
  Aruba: "Aruba",
  Brazil: "Brazil",
  Canada: "Canada",
  "Costa Rica": "Costa%20Rica",
  "Dominican Republic": "Dominican%20Republic",
  France: "France",
  India: "India",
  Italy: "Italy",
  Japan: "Japan",
  Mexico: "Mexico",
  Spain: "Spain",
  "United Kingdom": "United%20Kingdom",
  "USA (All)": "USA",
};

const usaRegionLabels = new Set([
  "California",
  "Florida",
  "Hawaii",
  "Nevada",
  "Arizona",
  "Colorado",
  "South Carolina",
  "Virginia",
  "Pennsylvania",
]);

function getDirectoryLink(groupHeading: string, label: string, href: string) {
  if (groupHeading === "United States" && usaRegionLabels.has(label)) {
    return `/resort-page/USA?region=${encodeURIComponent(label)}`;
  }

  const mapGroup = DIRECTORY_MAP_GROUPS.find((group) => group.label === label);
  if (mapGroup && label !== "Mexico" && label !== "Canada") {
    return `/resort-directory/map/${mapGroup.slug}`;
  }

  const country = countryRegionPaths[label];
  return country ? `/resort-directory/regions/${country}` : href;
}

export function MapSearchSection({ regions, className = "" }: Props) {
  return (
    <section id="map-search" className={`flex flex-col gap-4 ${className}`}>
      <h2 className="text-[28px] font-medium leading-[1.3] text-iw-ink md:text-[35px]">
        Map Search
      </h2>
      <div className="relative aspect-[1200/397] w-full overflow-hidden rounded-2xl bg-[#182541]">
        <Image
          src="/images/figma/directory/map.png"
          alt="World map of Interval resort regions"
          fill
          className="object-contain object-center"
          sizes="1200px"
        />
      </div>
      <div className="grid gap-8 pt-4 md:grid-cols-3">
        {regions.map((group) => (
          <div key={group.heading}>
            <h3 className="mb-3 text-[17px] font-medium text-iw-navy">{group.heading}</h3>
            <ul className="space-y-2">
              {group.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={getDirectoryLink(group.heading, link.label, link.href)}
                    className="text-[14px] font-medium text-iw-link hover:underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
