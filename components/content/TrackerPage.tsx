"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { trackerContent, type TrackerTrip } from "@/data/tracker";
import trips from "@/data/tracker-map-data.json";

type LeafletNS = {
  map: (el: HTMLElement, opts: Record<string, unknown>) => LeafletMap;
  tileLayer: (url: string, opts: Record<string, unknown>) => LeafletLayer;
  marker: (latlng: [number, number], opts?: Record<string, unknown>) => LeafletMarker;
  polyline: (latlngs: [number, number][], opts?: Record<string, unknown>) => LeafletLayer;
  icon: (opts: Record<string, unknown>) => unknown;
  control: {
    layers: (base: Record<string, unknown>) => { addTo: (map: LeafletMap) => unknown };
  };
};

type LeafletLayer = {
  addTo: (map: LeafletMap) => unknown;
  remove?: () => void;
};

type LeafletMap = {
  remove: () => void;
};

type LeafletMarker = {
  addTo: (map: LeafletMap) => LeafletMarker;
  on: (event: string, handler: () => void) => void;
  remove: () => void;
};

declare global {
  interface Window {
    L?: LeafletNS;
  }
}

const LEAFLET_JS_ID = "interval-tracker-leaflet-js";
const LEAFLET_CSS_ID = "interval-tracker-leaflet-css";

function parseCoord(value: string) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function loadScript(id: string, src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.getElementById(id) as HTMLScriptElement | null;
    if (existing) {
      if (existing.dataset.loaded === "1" || window.L) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error(`Failed ${src}`)));
      return;
    }
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "1";
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed ${src}`));
    document.head.appendChild(script);
  });
}

function loadCss(id: string, href: string) {
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

async function loadLeaflet(): Promise<LeafletNS> {
  loadCss(LEAFLET_CSS_ID, "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");
  await loadScript(LEAFLET_JS_ID, "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js");
  if (!window.L) throw new Error("Leaflet failed to load");
  return window.L;
}

export function TrackerPage() {
  const mapRef = useRef<HTMLDivElement>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const [selected, setSelected] = useState<TrackerTrip | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      try {
        const L = await loadLeaflet();
        if (cancelled || !mapRef.current) return;

        mapRef.current.innerHTML = "";
        const map = L.map(mapRef.current, {
          center: [trackerContent.mapCenter.lat, trackerContent.mapCenter.lng],
          zoom: trackerContent.mapZoom,
          scrollWheelZoom: true,
        });

        const streets = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap",
          maxZoom: 18,
        });
        const satellite = L.tileLayer(
          "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          { attribution: "Tiles &copy; Esri", maxZoom: 18 },
        );
        streets.addTo(map);
        L.control.layers({ Map: streets, Satellite: satellite }).addTo(map);

        const data = trips as TrackerTrip[];
        const animateCount = Math.min(28, data.length);
        const timers: number[] = [];
        const markers: LeafletMarker[] = [];

        data.forEach((trip, index) => {
          const dLat = parseCoord(trip.destinationResortLat);
          const dLng = parseCoord(trip.destinationResortLong);
          const sLat = parseCoord(trip.relinquishedResortLat);
          const sLng = parseCoord(trip.relinquishedResortLong);
          if (dLat == null || dLng == null) return;

          const run = () => {
            if (cancelled) return;
            const isExchange = trip.transactionType === "EX";
            const iconUrl = isExchange
              ? trackerContent.pins.exchange
              : trackerContent.pins.getaway;
            const marker = L.marker([dLat, dLng], {
              title: trip.destinationResortName,
              icon: L.icon({
                iconUrl,
                iconSize: [22, 32],
                iconAnchor: [11, 32],
              }),
            }).addTo(map);
            marker.on("click", () => setSelected(trip));
            markers.push(marker);

            if (sLat != null && sLng != null && index < animateCount) {
              const home = L.marker([sLat, sLng], {
                title: trip.relinquishedResortName,
                icon: L.icon({
                  iconUrl: trackerContent.pins.home,
                  iconSize: [14, 14],
                  iconAnchor: [7, 7],
                }),
              }).addTo(map);
              markers.push(home);
              L.polyline(
                [
                  [sLat, sLng],
                  [dLat, dLng],
                ],
                { color: "#ffffff", weight: 1.5, opacity: 0.9 },
              ).addTo(map);
            }
          };

          timers.push(
            window.setTimeout(run, index < animateCount ? index * 90 : animateCount * 90),
          );
        });

        // Leaflet needs a size pass after layout.
        window.setTimeout(() => {
          const leafletMap = map as LeafletMap & { invalidateSize?: () => void };
          leafletMap.invalidateSize?.();
        }, 100);

        if (!cancelled) setReady(true);
        cleanupRef.current = () => {
          timers.forEach((id) => window.clearTimeout(id));
          markers.forEach((m) => m.remove());
          map.remove();
        };
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Map failed to load");
        }
      }
    }

    void boot();

    return () => {
      cancelled = true;
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, []);

  const heading =
    selected?.transactionType === "EX" ? "Exchange" : selected ? "Getaway" : null;

  return (
    <main id="main-content" className="tracker-page">
      <div className="tracker-shell">
        <div className="tracker-container">
          <h1>{trackerContent.title}</h1>
          {trackerContent.paragraphs.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}

          <div className="tracker-map-wrap">
            <div
              id="map_canvas"
              ref={mapRef}
              className="tracker-map-canvas"
              aria-label="Interval Exchange Tracker map"
            />
            {!ready && !error && <div className="tracker-map-loading">Loading map…</div>}
            {error && <div className="tracker-map-loading">{error}</div>}
          </div>

          {selected && heading && (
            <div className="tracker-popup" role="dialog" aria-label={heading}>
              <button
                type="button"
                className="tracker-popup-close"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                ×
              </button>
              <h4>{heading}</h4>
              <div className="tracker-popup-grid">
                <div className="tracker-popup-col">
                  <div className="tracker-popup-label">From</div>
                  <div className="tracker-popup-name">{selected.relinquishedResortName}</div>
                  <div className="tracker-popup-loc">
                    {selected.relinquishedCity}, {selected.relinquishedCountry}
                  </div>
                </div>
                <div className="tracker-popup-col">
                  <div className="tracker-popup-label">To</div>
                  <div className="tracker-popup-name">{selected.destinationResortName}</div>
                  <div className="tracker-popup-loc">
                    {selected.destiantionCity}, {selected.destinationCountry}
                  </div>
                </div>
              </div>
            </div>
          )}

          <section className="tracker-legend">
            <h2>{trackerContent.legendTitle}</h2>
            <p className="tracker-legend-row">
              <Image
                src={trackerContent.legend[0].icon}
                alt=""
                width={trackerContent.legend[0].iconWidth}
                height={trackerContent.legend[0].iconHeight}
              />{" "}
              {trackerContent.legend[0].text}{" "}
              <Image
                src={trackerContent.legend[1].icon}
                alt=""
                width={trackerContent.legend[1].iconWidth}
                height={trackerContent.legend[1].iconHeight}
              />{" "}
              {trackerContent.legend[1].text}
            </p>
            <p className="tracker-legend-row">
              <Image
                src={trackerContent.legend[2].icon}
                alt=""
                width={trackerContent.legend[2].iconWidth}
                height={trackerContent.legend[2].iconHeight}
              />{" "}
              {trackerContent.legend[2].text}
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
