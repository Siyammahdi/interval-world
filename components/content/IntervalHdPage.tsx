"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { HdRegion, HdVideo } from "@/data/interval-hd";

/** Live jcarousel pages hold 6 thumbs (2 rows × 3). */
const PER_PAGE = 6;

function VideoCard({
  video,
  playOverlay,
}: {
  video: HdVideo;
  playOverlay: string;
}) {
  const href = video.href.startsWith("#") ? `/web/my/channel${video.href}` : video.href;

  return (
    <article className="ihd-thumb">
      {video.justAdded && video.badgeLabel && (
        <>
          <span className="ihd-just-added">{video.badgeLabel}</span>
          <span className="ihd-just-added-fold" aria-hidden />
        </>
      )}
      <Link href={href} className="ihd-thumb-media" aria-label={`Play Video for ${video.title}`}>
        <span
          className="ihd-thumb-play"
          style={{ backgroundImage: `url(${playOverlay})` }}
          aria-hidden
        />
        <Image
          src={video.image}
          alt={video.title}
          width={280}
          height={151}
          className="ihd-thumb-img"
          unoptimized={video.image.startsWith("http")}
        />
      </Link>
      <div className="ihd-thumb-meta">
        <div className="ihd-thumb-title-row">
          <em className="ihd-thumb-duration">{video.duration}</em>
          <Link href={href} className="ihd-thumb-title" title={video.title}>
            {video.title}
          </Link>
        </div>
        {video.location ? <small className="ihd-thumb-location">{video.location}</small> : null}
      </div>
    </article>
  );
}

function RegionCarousel({
  region,
  playOverlay,
}: {
  region: HdRegion;
  playOverlay: string;
}) {
  const pages = Math.max(1, Math.ceil(region.videos.length / PER_PAGE));
  const [page, setPage] = useState(0);
  const slice = useMemo(() => {
    const start = page * PER_PAGE;
    return region.videos.slice(start, start + PER_PAGE);
  }, [page, region.videos]);
  const showControls = pages > 1;

  return (
    <section id={region.slug} className="ihd-region">
      <div className="ihd-region-header">
        <h2>{region.name}</h2>
      </div>
      <div className="ihd-carousel">
        {showControls && (
          <button
            type="button"
            className="ihd-carousel-btn ihd-carousel-prev"
            aria-label={`Previous ${region.name} videos`}
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          />
        )}
        <div className="ihd-carousel-track">
          {slice.map((video) => (
            <VideoCard
              key={`${video.title}-${video.duration}-${video.image}`}
              video={video}
              playOverlay={playOverlay}
            />
          ))}
        </div>
        {showControls && (
          <button
            type="button"
            className="ihd-carousel-btn ihd-carousel-next"
            aria-label={`Next ${region.name} videos`}
            disabled={page >= pages - 1}
            onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
          />
        )}
      </div>
      {showControls && pages <= 40 && (
        <div className="ihd-dots" role="tablist" aria-label={`${region.name} pages`}>
          {Array.from({ length: pages }, (_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === page}
              aria-label={`Page ${i + 1}`}
              className={i === page ? "active" : undefined}
              onClick={() => setPage(i)}
            />
          ))}
        </div>
      )}
      {showControls && pages > 40 && (
        <p className="ihd-page-status">
          {page + 1} / {pages}
        </p>
      )}
    </section>
  );
}

type IntervalHdPageProps = {
  data: {
    title: string;
    tagline: string;
    learnMoreHref: string;
    heroImage: string;
    logoSmall: string;
    playOverlay: string;
    tabs: readonly { label: string; href: string; active: boolean }[];
    regionLinks: readonly { label: string; href: string }[];
    regions: HdRegion[];
  };
};

export function IntervalHdPage({ data }: IntervalHdPageProps) {
  const learnHref = data.learnMoreHref.startsWith("#")
    ? `/web/my/channel${data.learnMoreHref}`
    : data.learnMoreHref;

  return (
    <main id="main-content" className="ihd-page">
      <div className="ihd-shell">
        <section
          className="ihd-hero"
          style={{ backgroundImage: `url(${data.heroImage})` }}
          aria-label={data.title}
        >
          <h2 className="sr-only">{data.title}</h2>
          <p className="sr-only">{data.tagline}</p>
          <Link href={learnHref} className="ihd-hero-cta">
            Learn More
          </Link>
        </section>

        <div className="ihd-content">
          <nav className="ihd-tabs" aria-label="Interval HD sections">
            <ul>
              {data.tabs.map((tab) => (
                <li key={tab.label} className={tab.active ? "active" : undefined}>
                  <Link href={tab.href}>{tab.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="ihd-region-links" aria-label="Regions">
            <ul>
              {data.regionLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          {data.regions.map((region) => (
            <RegionCarousel key={region.slug} region={region} playOverlay={data.playOverlay} />
          ))}
        </div>
      </div>
    </main>
  );
}
