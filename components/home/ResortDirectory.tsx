import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/data/homepage";

type ResortDirectoryProps = {
  destinations: Destination[];
};

/** Split destinations into columns of 4 for the directory grid */
function columnsFrom(items: Destination[], perCol = 4) {
  const cols: Destination[][] = [];
  for (let i = 0; i < items.length; i += perCol) {
    cols.push(items.slice(i, i + perCol));
  }
  return cols;
}

export function ResortDirectory({ destinations }: ResortDirectoryProps) {
  const columns = columnsFrom(destinations, 4);

  return (
    <section className="mb-6" aria-labelledby="directory-heading">
      <div className="flex flex-col gap-0 border border-[#d0d7e0] md:flex-row">
        {/* Directory */}
        <div className="flex flex-1 gap-4 p-4">
          <Link href="/resort-directory" className="shrink-0 self-start">
            <Image
              src="/images/misc/catalog.jpg"
              alt="Interval Resort Directory"
              width={70}
              height={84}
              className="h-[84px] w-[70px]"
            />
          </Link>

          <div className="min-w-0 flex-1">
            <h2 id="directory-heading" className="mb-1 text-[15px] font-bold text-iw-blue">
              <Link href="/resort-directory" className="hover:underline">
                Interval&apos;s Resort Directory
              </Link>
            </h2>

            <p className="mb-2 flex items-center gap-1.5 text-[11px]">
              <Image src="/images/misc/icon_mobile.gif" alt="" width={16} height={16} aria-hidden />
              <Link href="/web/cs/mobile-app" className="text-iw-blue hover:underline">
                Download Interval App
              </Link>
            </p>

            <div className="grid grid-cols-2 gap-x-4 sm:grid-cols-4">
              {columns.map((col, colIndex) => (
                <ul key={colIndex} className="space-y-0.5 text-[12px]">
                  {col.map((dest) => (
                    <li key={dest.label}>
                      <Link
                        href={dest.href}
                        className={
                          dest.label === "View All"
                            ? "font-bold text-iw-blue hover:underline"
                            : "text-iw-blue hover:underline"
                        }
                      >
                        {dest.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>

        {/* Interval HD */}
        <aside className="shrink-0 border-t border-[#d0d7e0] md:w-[220px] md:border-l md:border-t-0">
          <Link href="/web/my/channel" className="block h-full">
            <Image
              src="/images/misc/intervalhd.jpg"
              alt="Interval HD — Now with helpful videos."
              width={220}
              height={140}
              className="h-full w-full object-cover"
            />
          </Link>
        </aside>
      </div>
    </section>
  );
}
