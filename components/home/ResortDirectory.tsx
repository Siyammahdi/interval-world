import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/data/homepage";

type Props = {
  destinations: Destination[];
};

export function ResortDirectory({ destinations }: Props) {
  const viewAll = destinations.find((d) => d.label.toLowerCase().includes("view"));
  const places = destinations.filter((d) => d !== viewAll);
  const columns: Destination[][] = [[], [], [], [], []];
  places.forEach((dest, i) => {
    columns[i % 5].push(dest);
  });

  return (
    <section className="w-full bg-iw-surface px-6 py-[60px] md:px-[120px] md:py-[100px]">
      <div className="mx-auto w-full max-w-[1200px]">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3 border-b border-iw-border pb-6">
          <h2 className="text-[28px] font-medium leading-[1.3] text-iw-ink md:text-[35px]">
            Interval&apos;s Resort Directory
          </h2>
          <Link
            href="/web/cs/mobile-app"
            className="text-[18px] font-medium text-iw-link underline decoration-2 underline-offset-4 md:text-[20px]"
          >
            Download Interval&apos;s App
          </Link>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl bg-white px-4 py-6 md:flex-row md:items-center md:justify-between">
          <div className="grid flex-1 grid-cols-2 gap-x-2 gap-y-0 sm:grid-cols-3 lg:grid-cols-5">
            {columns.map((col, colIndex) => (
              <div
                key={colIndex}
                className={`flex flex-col gap-4 pr-2 text-[14px] font-medium leading-[1.6] text-iw-ink ${
                  colIndex < 4 ? "lg:border-r lg:border-iw-border" : ""
                }`}
              >
                {col.map((dest) => (
                  <Link key={dest.label + dest.href} href={dest.href} className="hover:text-iw-link">
                    {dest.label}
                  </Link>
                ))}
                {colIndex === 4 && viewAll ? (
                  <Link
                    href={viewAll.href}
                    className="text-[17px] font-bold text-iw-link underline"
                  >
                    View all
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
          <Link href="/web/cs/interval-hd" className="mx-auto shrink-0 md:mx-0">
            <Image
              src="/images/figma/home/intervalhd.png"
              alt="intervalHD — Now with helpful videos"
              width={228}
              height={137}
              className="h-auto w-[228px]"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
