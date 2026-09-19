"use client";

import { useMemo, useState } from "react";
import { rewriteLiveHtmlLinks } from "@/lib/rewrite-live-links";

type OfficesContentProps = {
  html: string;
};

type CountryOption = {
  id: string;
  label: string;
};

type OfficeRow = {
  location: string;
  contact: string;
  hours: string;
  languages: string;
  locationLarge?: boolean;
};

/** USA World Headquarters — Figma Contact us / Our Offices (33:1999 / 37:2139) */
const USA_ROWS: OfficeRow[] = [
  {
    location: "U.S.A.\nWorld Headquarters",
    contact: '("800," "888," and "877" numbers are toll-free from U.S., Canada, P.R., U.S.V.I.)',
    hours: "(U.S. Eastern time)",
    languages: "",
    locationLarge: true,
  },
  {
    location: "6262 Sunset Drive\nMiami, Florida 33143-4843",
    contact: "",
    hours: "",
    languages: "",
  },
  {
    location: "Post Office Box 431920\nMiami, Florida 33243-1920\nIntervalWorld.com",
    contact: "Deposits and Requests\n1.800.INTERVAL (1.800.468.3782)",
    hours:
      "Monday through Friday\n9:00 a.m. to 11:00 p.m.\nSaturday\n10:00 a.m. to 8:00 p.m.\nSunday\nClosed",
    languages: "English\nSpanish\nFrench\nPortuguese",
  },
  {
    location: "Exchange Services\nPost Office Box 432170\nMiami, Florida 33243-2170",
    contact:
      "Deposits and Requests\n1.800.INTERVAL (1.800.468.3782)\n305-666-1884\n305-665-1918 (Spanish)\nfax: 305-668-3423\nwww.intervalworld.com\nCheck-In Assistance\n877-700-1154\n305-668-3411\nfax: 305-668-3423",
    hours:
      "Monday through Friday\n9:00 a.m. to 11:00 p.m.\nSaturday\n10:00 a.m. to 8:00 p.m.\nSunday\nClosed",
    languages: "English\nSpanish\nFrench\nPortuguese",
  },
  {
    location: "Membership Services\nPost Office Box 431920\nMiami, Florida 33243-1920",
    contact: "Member Services\n1.800.777.7350\n305-666-1861\nfax: 305-665-0532",
    hours:
      "Monday through Friday\n9:00 a.m. to 11:00 p.m.\nSaturday\n10:00 a.m. to 8:00 p.m.\nSunday\nClosed",
    languages: "English\nSpanish\nFrench\nPortuguese",
  },
  {
    location: "Getaways\nPost Office Box 431920\nMiami, Florida 33243-1920",
    contact: "Getaways Reservations\n1.877.478.7732\n305-666-1861",
    hours:
      "Monday through Friday\n9:00 a.m. to 11:00 p.m.\nSaturday\n10:00 a.m. to 8:00 p.m.\nSunday\nClosed",
    languages: "English\nSpanish\nFrench\nPortuguese",
  },
];

function parseCountries(html: string): CountryOption[] {
  const selectMatch = html.match(/<select[^>]*name="select2"[^>]*>([\s\S]*?)<\/select>/i);
  if (!selectMatch) return [{ id: "usa", label: "USA" }];
  return [...selectMatch[1].matchAll(/<option[^>]*value="([^"]*)"[^>]*>([\s\S]*?)<\/option>/gi)]
    .map((m) => ({
      id: m[1].replace(/^#/, "").trim(),
      label: m[2].replace(/<[^>]+>/g, "").trim(),
    }))
    .filter((o) => o.id && o.label && !/select location/i.test(o.label));
}

function extractCountryHtml(html: string, id: string): string {
  const lower = html.toLowerCase();
  const needleName = `name="${id}"`;
  const needleId = `id="${id}"`;
  let start = lower.indexOf(needleName);
  if (start < 0) start = lower.indexOf(needleId);
  if (start < 0) return "";

  const from = start;
  const searchFrom = from + 200;
  const slice = html.slice(searchFrom);
  const re = /(?:name|id)="([a-z][a-z0-9_-]*)"/gi;
  let end = html.length;
  let m: RegExpExecArray | null;
  while ((m = re.exec(slice))) {
    const found = m[1].toLowerCase();
    if (found !== id && found !== "select2" && found.length > 2) {
      end = searchFrom + m.index;
      break;
    }
  }
  return html.slice(from, end);
}

function CellText({
  value,
  large,
  muted,
}: {
  value: string;
  large?: boolean;
  muted?: boolean;
}) {
  if (!value) {
    return <span className="iw-offices-cell iw-offices-cell--empty" aria-hidden />;
  }
  return (
    <span
      className={[
        "iw-offices-cell",
        large ? "iw-offices-cell--lg" : null,
        muted ? "iw-offices-cell--muted" : null,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {value.split("\n").map((line, i) => (
        <span key={`${line}-${i}`}>
          {i > 0 ? <br /> : null}
          {line}
        </span>
      ))}
    </span>
  );
}

/**
 * Our Offices — Figma Contact us (node 33:1999)
 */
export function OfficesContent({ html }: OfficesContentProps) {
  const bodyHtml = useMemo(() => rewriteLiveHtmlLinks(html), [html]);
  const countries = useMemo(() => parseCountries(bodyHtml), [bodyHtml]);
  const [country, setCountry] = useState("usa");

  const otherHtml = useMemo(() => {
    if (country === "usa") return "";
    return extractCountryHtml(bodyHtml, country);
  }, [bodyHtml, country]);

  return (
    <div className="iw-offices-figma">
      <div className="iw-offices-figma__intro">
        <h2>Our Offices</h2>
        <p>
          To find your local Interval servicing office, please select your country of residency from
          the drop down below.
        </p>
      </div>

      <div className="iw-offices-figma__filter">
        <label htmlFor="office-country">Country of Residency:</label>
        <select
          id="office-country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          {countries.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {country === "usa" ? (
        <div className="iw-offices-card">
          <div className="iw-offices-card__head">
            <span>Location</span>
            <span>Contact Information</span>
            <span>
              Contact Information
              <br />
              Member-Services Center
              <br />
              Hours Of Operation
            </span>
            <span>Languages Spoken</span>
          </div>

          {USA_ROWS.map((row, index) => {
            const showDivider = index > 2;
            return (
              <div key={`${row.location}-${index}`} className="iw-offices-card__block">
                {showDivider ? <div className="iw-offices-card__rule" aria-hidden /> : null}
                <div className="iw-offices-card__row">
                  <CellText
                    value={row.location}
                    large={row.locationLarge}
                    muted={!row.locationLarge && Boolean(row.location)}
                  />
                  <CellText value={row.contact} />
                  <CellText value={row.hours} />
                  <CellText value={row.languages} />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className="iw-offices-card iw-offices-card--legacy"
          dangerouslySetInnerHTML={{
            __html:
              otherHtml ||
              "<p>Office details for this location are not available in the demo content.</p>",
          }}
        />
      )}
    </div>
  );
}
