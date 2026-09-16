"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

const STORAGE_KEY = "iw-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) setVisible(true);
  }, []);

  function choose(value: "accepted" | "rejected") {
    window.localStorage.setItem(STORAGE_KEY, value);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-prefs-title"
      className="fixed bottom-4 left-1/2 z-[90] w-[min(92vw,420px)] -translate-x-1/2 rounded-md border border-[#d5dde6] bg-white p-5 shadow-2xl"
    >
      <h2 id="cookie-prefs-title" className="mb-2 text-lg font-semibold text-iw-navy">
        Cookie Preferences
      </h2>
      <p className="mb-4 text-[13px] leading-relaxed text-iw-navy">
        By clicking &quot;Accept All Cookies&quot;, you agree to the storing of cookies on your device to
        enhance site navigation, analyze site usage, and assist in our marketing efforts.{" "}
        <a href="https://privacy.intervalworld.com/" className="text-iw-blue underline">
          Privacy &amp; Cookie Policy
        </a>
      </p>
      <div className="flex flex-col gap-2">
        <Button className="w-full" onClick={() => choose("accepted")}>
          Accept All Cookies
        </Button>
        <Button className="w-full" onClick={() => choose("rejected")}>
          Reject All Cookies
        </Button>
        <button
          type="button"
          className="mt-1 text-center text-[13px] text-iw-blue underline"
          onClick={() => choose("rejected")}
        >
          Cookie Settings
        </button>
      </div>
    </div>
  );
}
