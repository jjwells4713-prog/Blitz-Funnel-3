"use client";

import Script from "next/script";
import { useEffect } from "react";
import { track } from "@/lib/tracking";

const WISTIA_ID = "ohv3ax359s";

/**
 * VSL video player — just the video. Drop it anywhere you want the VSL to render
 * (e.g. inside the hero). Tracks first play via _wq → track.viewContentVSL().
 */
export default function VSL() {
  useEffect(() => {
    window._wq = window._wq || [];
    let alreadyFired = false;
    window._wq.push({
      id: WISTIA_ID,
      onReady: (video) => {
        video.bind("play", () => {
          if (alreadyFired) return;
          alreadyFired = true;
          track.viewContentVSL();
        });
      },
    });
  }, []);

  return (
    <div className="relative">
      {/* Violet border glow */}
      <div
        aria-hidden
        className="absolute -inset-px rounded-2xl bg-gradient-to-br from-violet-500/60 via-violet-400/20 to-transparent opacity-60 blur-sm"
      />
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink-800 shadow-glow-lg">
        {/* Custom element — dangerouslySetInnerHTML keeps SSR clean. */}
        <div
          dangerouslySetInnerHTML={{
            __html: `<wistia-player media-id="${WISTIA_ID}" aspect="1.7777777777777777" autoplay="true" muted="true" playsinline="true"></wistia-player>`,
          }}
        />
      </div>

      {/* Wistia scripts — loaded lazily, below-the-fold friendly */}
      <Script src="https://fast.wistia.com/player.js" strategy="lazyOnload" />
      <Script
        src={`https://fast.wistia.com/embed/${WISTIA_ID}.js`}
        strategy="lazyOnload"
        type="module"
      />
    </div>
  );
}
