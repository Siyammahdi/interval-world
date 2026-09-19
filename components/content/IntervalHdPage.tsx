"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { AskExpert } from "@/components/home/AskExpert";
import type { HdRegion, HdVideo } from "@/data/interval-hd";
import { cn } from "@/lib/cn";

/** Figma grid: 3 columns × 4 rows */
const PER_PAGE = 12;
const FALLBACK_THUMB = "/images/figma/hd/hero.png";

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

function videoIdFromHref(href: string) {
  const m = href.match(/vid=(\d+)/);
  return m?.[1] ?? "";
}

function resolveSrc(video: HdVideo) {
  return video.src || `/videos/hd/${video.id || videoIdFromHref(video.href)}.mp4`;
}

function resolveThumb(image: string) {
  if (!image) return FALLBACK_THUMB;
  if (image.startsWith("http://")) return image.replace(/^http:\/\//i, "https://");
  return image;
}

function VideoThumb({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [current, setCurrent] = useState(() => resolveThumb(src));

  useEffect(() => {
    setCurrent(resolveThumb(src));
  }, [src]);

  return (
    // Native img avoids next/image optimizer issues with mixed local/Brightcove assets
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={current}
      alt={alt}
      className={cn("absolute inset-0 h-full w-full object-cover", className)}
      loading="lazy"
      onError={() => {
        if (current !== FALLBACK_THUMB) setCurrent(FALLBACK_THUMB);
      }}
    />
  );
}

function VideoCard({
  video,
  onPlay,
}: {
  video: HdVideo;
  onPlay: (video: HdVideo) => void;
}) {
  return (
    <article className="flex w-full max-w-[384px] flex-col gap-4">
      <div className="relative w-full">
        <button
          type="button"
          className="relative block h-[220px] w-full overflow-hidden rounded-lg bg-[#e8e8e8] text-left"
          aria-label={`Play video: ${video.title}`}
          onClick={() => onPlay(video)}
        >
          <VideoThumb src={video.image} alt={video.title} />
          {video.justAdded && video.badgeLabel ? (
            <span className="absolute left-0 top-3 z-10 bg-[#0c90da] px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white">
              {video.badgeLabel}
            </span>
          ) : null}
          <span className="pointer-events-none absolute left-1/2 top-[78px] z-10 size-[63px] -translate-x-1/2">
            <Image
              src="/images/figma/hd/thumb-play.svg"
              alt=""
              width={63}
              height={63}
              className="size-[63px]"
            />
          </span>
        </button>
      </div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-3 text-iw-ink">
          <button
            type="button"
            className="min-w-0 flex-1 truncate text-left text-[20px] font-normal leading-normal hover:text-[#0c90da]"
            title={video.title}
            onClick={() => onPlay(video)}
          >
            {video.title}
          </button>
          <span className="shrink-0 text-[14px] font-bold leading-[1.6] tracking-[0.14px]">
            {video.duration}
          </span>
        </div>
        {video.location ? (
          <p className="text-[12px] font-normal leading-normal text-[#757575]">{video.location}</p>
        ) : null}
      </div>
    </article>
  );
}

function VideoModal({
  video,
  onClose,
}: {
  video: HdVideo;
  onClose: () => void;
}) {
  const src = resolveSrc(video);
  const poster = resolveThumb(video.image);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    setChecking(true);
    setError(null);

    (async () => {
      try {
        const res = await fetch(src, { method: "HEAD", cache: "no-store" });
        if (cancelled) return;
        if (!res.ok) {
          setError("This video isn’t available locally yet. Please try again shortly.");
        }
      } catch {
        if (!cancelled) {
          setError("Unable to load this video right now.");
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [src]);

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={video.title}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[960px] overflow-hidden rounded-2xl bg-black shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4 bg-[#151b17] px-4 py-3 text-white">
          <p className="m-0 truncate text-[16px] font-medium">{video.title}</p>
          <button
            type="button"
            className="shrink-0 rounded-lg bg-white/10 px-3 py-1.5 text-[14px] hover:bg-white/20"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {error ? (
          <div className="flex aspect-video flex-col items-center justify-center gap-3 bg-[#101010] px-6 text-center text-white">
            <p className="m-0 text-[16px] font-medium">{error}</p>
            <p className="m-0 text-[13px] text-white/70">
              Local file: <code className="text-white/90">{src}</code>
            </p>
          </div>
        ) : (
          <video
            key={src}
            className="aspect-video w-full bg-black"
            controls
            autoPlay={!checking}
            playsInline
            poster={poster.startsWith("http") ? undefined : poster}
            src={src}
            onError={() =>
              setError("This video file couldn’t be played. It may still be downloading.")
            }
          >
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </div>
  );
}

function pageWindow(current: number, total: number, size = 5) {
  if (total <= size) return Array.from({ length: total }, (_, i) => i);
  const half = Math.floor(size / 2);
  let start = Math.max(0, current - half);
  let end = start + size;
  if (end > total) {
    end = total;
    start = Math.max(0, end - size);
  }
  return Array.from({ length: end - start }, (_, i) => start + i);
}

export function IntervalHdPage({ data }: IntervalHdPageProps) {
  const [mode, setMode] = useState<"destinations" | "helpful">("destinations");
  const [helpfulTab, setHelpfulTab] = useState<"helpful" | "highlights">("helpful");
  const [regionIndex, setRegionIndex] = useState(0);
  const [page, setPage] = useState(0);
  const [active, setActive] = useState<HdVideo | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("tab") === "helpful") {
      setMode("helpful");
      setPage(0);
    }
  }, []);

  const heroVideo = useMemo(() => {
    const id = videoIdFromHref(data.learnMoreHref);
    if (!id) return null;
    const found = data.regions.flatMap((r) => r.videos).find((v) => v.id === id);
    return (
      found ?? {
        href: data.learnMoreHref,
        id,
        src: `/videos/hd/${id}.mp4`,
        title: "Presenting Interval HD",
        location: "",
        duration: "",
        image: data.heroImage,
      }
    );
  }, [data]);

  const activeRegion = data.regions[regionIndex] ?? data.regions[0];

  const helpfulVideos = useMemo(() => {
    const all = data.regions.flatMap((r) => r.videos);
    if (helpfulTab === "highlights") {
      const marked = all.filter((v) => v.justAdded || Boolean(v.badgeLabel));
      return marked.length > 0 ? marked : all.slice(0, 24);
    }
    return all.filter((v) => !v.justAdded && !v.badgeLabel).slice(0, 48);
  }, [data.regions, helpfulTab]);

  const sourceVideos = mode === "destinations" ? activeRegion?.videos ?? [] : helpfulVideos;
  const totalPages = Math.max(1, Math.ceil(sourceVideos.length / PER_PAGE));
  const safePage = Math.min(page, totalPages - 1);
  const pageVideos = sourceVideos.slice(safePage * PER_PAGE, safePage * PER_PAGE + PER_PAGE);
  const pages = pageWindow(safePage, totalPages);

  function selectRegion(index: number) {
    setRegionIndex(index);
    setPage(0);
  }

  function selectMode(next: "destinations" | "helpful") {
    setMode(next);
    setPage(0);
  }

  return (
    <main id="main-content" className="bg-white">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center gap-8 px-4 pb-[50px] pt-0 md:px-[120px]">
        <div className="flex w-full flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="m-0 text-[28px] font-medium leading-[1.3] text-[#0f2a5c] md:text-[35px]">
            Vacation Planning made easy
          </h1>
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-[12px] font-medium leading-[1.6] tracking-[0.12px]"
          >
            <Link href="/" className="text-[#757575] hover:text-[#0c90da]">
              Home
            </Link>
            <Image
              src="/images/figma/ownership/chevron.svg"
              alt=""
              width={5}
              height={8}
              className="mx-0.5 h-2 w-auto"
              aria-hidden
            />
            <span className="text-[#101010]">Vacation Planning made easy</span>
          </nav>
        </div>

        <div className="flex w-full flex-col gap-8">
          <section
            className="relative h-[220px] w-full overflow-hidden rounded-2xl md:h-[378px]"
            aria-label={data.title}
          >
            <Image
              src={data.heroImage}
              alt={data.tagline}
              fill
              priority
              className="object-cover object-center"
              sizes="1200px"
            />
            <button
              type="button"
              className="absolute inset-0 flex items-center justify-center"
              aria-label="Play Presenting Interval HD"
              onClick={() => heroVideo && setActive(heroVideo)}
            >
              <Image
                src="/images/figma/hd/play.svg"
                alt=""
                width={121}
                height={121}
                className="size-[121px]"
              />
            </button>
          </section>

          <div className="flex w-full flex-col items-center gap-12">
            <div className="flex w-full max-w-[672px] flex-col items-center gap-6">
              <div
                role="tablist"
                aria-label="Interval HD sections"
                className="flex w-full gap-4 rounded-2xl bg-[#f1f1f1] p-2"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "destinations"}
                  className={cn(
                    "flex-1 rounded-lg p-2.5 text-center text-[15px] font-medium transition-colors md:text-[17px]",
                    mode === "destinations"
                      ? "bg-[#0c90da] text-white"
                      : "bg-white text-[#101010] hover:bg-white/80",
                  )}
                  onClick={() => selectMode("destinations")}
                >
                  Destinations &amp; Resorts
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === "helpful"}
                  className={cn(
                    "flex-1 rounded-lg p-2.5 text-center text-[15px] font-medium transition-colors md:text-[17px]",
                    mode === "helpful"
                      ? "bg-[#0c90da] text-white"
                      : "bg-white text-[#101010] hover:bg-white/80",
                  )}
                  onClick={() => selectMode("helpful")}
                >
                  Helpful Videos
                </button>
              </div>

              {mode === "destinations" ? (
                <div className="flex w-full flex-col gap-4">
                  <nav
                    aria-label="Regions"
                    className="flex w-full flex-wrap items-center justify-between gap-x-4 gap-y-2"
                  >
                    {data.regions.map((region, index) => (
                      <button
                        key={region.slug}
                        type="button"
                        className={cn(
                          "whitespace-nowrap transition-colors",
                          index === regionIndex
                            ? "text-[17px] font-bold text-[#027fc2] md:text-[20px]"
                            : "text-[15px] font-medium text-[#757575] hover:text-[#027fc2] md:text-[17px]",
                        )}
                        onClick={() => selectRegion(index)}
                      >
                        {region.name}
                      </button>
                    ))}
                  </nav>
                  <div className="h-px w-full bg-[#d2d2d2]" aria-hidden />
                </div>
              ) : (
                <div className="flex w-full flex-col gap-4">
                  <nav
                    aria-label="Helpful video categories"
                    className="flex w-full flex-wrap items-center justify-center gap-x-10 gap-y-2"
                  >
                    <button
                      type="button"
                      className={cn(
                        "whitespace-nowrap transition-colors",
                        helpfulTab === "helpful"
                          ? "text-[17px] font-bold text-[#027fc2] md:text-[20px]"
                          : "text-[15px] font-medium text-[#757575] hover:text-[#027fc2] md:text-[17px]",
                      )}
                      onClick={() => {
                        setHelpfulTab("helpful");
                        setPage(0);
                      }}
                    >
                      Helpful Videos
                    </button>
                    <button
                      type="button"
                      className={cn(
                        "whitespace-nowrap transition-colors",
                        helpfulTab === "highlights"
                          ? "text-[17px] font-bold text-[#027fc2] md:text-[20px]"
                          : "text-[15px] font-medium text-[#757575] hover:text-[#027fc2] md:text-[17px]",
                      )}
                      onClick={() => {
                        setHelpfulTab("highlights");
                        setPage(0);
                      }}
                    >
                      Highlights
                    </button>
                  </nav>
                  <div className="h-px w-full bg-[#d2d2d2]" aria-hidden />
                </div>
              )}
            </div>

            <div className="grid w-full grid-cols-1 justify-items-center gap-x-6 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
              {pageVideos.map((video) => (
                <VideoCard
                  key={`${video.id || video.title}-${video.duration}`}
                  video={video}
                  onPlay={setActive}
                />
              ))}
            </div>

            {totalPages > 1 ? (
              <nav
                aria-label="Pagination"
                className="flex flex-wrap items-center justify-center gap-4 pt-2 text-[14px] font-medium text-[#101010]"
              >
                <button
                  type="button"
                  className="disabled:opacity-40"
                  disabled={safePage === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  &lt; Back
                </button>
                <div className="flex items-center gap-2">
                  {pages.map((i) => (
                    <button
                      key={i}
                      type="button"
                      aria-current={i === safePage ? "page" : undefined}
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full",
                        i === safePage ? "bg-[#101010] text-white" : "hover:bg-[#f1f1f1]",
                      )}
                      onClick={() => setPage(i)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  className="disabled:opacity-40"
                  disabled={safePage >= totalPages - 1}
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                >
                  Next &gt;
                </button>
              </nav>
            ) : null}
          </div>
        </div>
      </div>
      <AskExpert />
      {active ? <VideoModal video={active} onClose={() => setActive(null)} /> : null}
    </main>
  );
}
