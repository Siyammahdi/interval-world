/**
 * Patch data/interval-hd.ts so each video has a local Brightcove id + src path.
 * Remote thumbnail URLs are left as-is (or already localized); playback uses /videos/hd/{id}.mp4.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILE = join(ROOT, "data", "interval-hd.ts");

let raw = readFileSync(FILE, "utf8");

if (!raw.includes("src?: string")) {
  raw = raw.replace(
    `export type HdVideo = {
  href: string;
  title: string;
  location: string;
  duration: string;
  image: string;
  justAdded?: boolean;
  badgeLabel?: string;
};`,
    `export type HdVideo = {
  href: string;
  /** Brightcove video id from intervalworld.com */
  id: string;
  /** Local progressive MP4 under our control */
  src: string;
  title: string;
  location: string;
  duration: string;
  image: string;
  justAdded?: boolean;
  badgeLabel?: string;
};`,
  );
}

// Insert id + src after each href that contains vid=
raw = raw.replace(
  /"href": "(#vid=(\d+)[^"]*)"(,\r?\n)(\s*)"title":/g,
  (_m, href, id, nl, indent) =>
    `"href": "${href}"${nl}${indent}"id": "${id}"${nl}${indent}"src": "/videos/hd/${id}.mp4"${nl}${indent}"title":`,
);

// Avoid duplicating if re-run
raw = raw.replace(
  /("id": "\d+",\r?\n\s*"src": "\/videos\/hd\/\d+\.mp4",\r?\n\s*)+"id":/g,
  `"id":`,
);

// Clean accidental double id/src blocks from re-runs
raw = raw.replace(
  /("id": "(\d+)",\r?\n\s*"src": "\/videos\/hd\/\2\.mp4",\r?\n\s*){2,}/g,
  `"id": "$2",\n        "src": "/videos/hd/$2.mp4",\n        `,
);

writeFileSync(FILE, raw);
console.log("Patched interval-hd.ts with local video id/src fields");
