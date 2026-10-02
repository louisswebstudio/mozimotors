"use client";

import { useEffect, useRef } from "react";

/**
 * Muted looping hero video that keeps playing on phones. Mobile browsers pause background video when the
 * tab is hidden, after a client-side navigation or a language switch, and iOS Low Power Mode blocks
 * autoplay until the first touch — so we re-start it on every event that can pause it.
 */
export function HeroVideo({ poster, webm, mp4 }: { poster: string; webm: string; mp4: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    // React does not reliably render the `muted` attribute; autoplay needs it set as a property.
    v.muted = true;
    v.defaultMuted = true;

    const play = () => {
      if (document.hidden || !v.paused) return;
      v.play().catch(() => {});
    };
    const onVisible = () => !document.hidden && play();
    const gestures = ["touchstart", "pointerdown", "scroll", "keydown"] as const;

    play();
    v.addEventListener("pause", play);
    v.addEventListener("canplay", play);
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("pageshow", play);
    gestures.forEach((g) => window.addEventListener(g, play, { passive: true }));
    return () => {
      v.removeEventListener("pause", play);
      v.removeEventListener("canplay", play);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("pageshow", play);
      gestures.forEach((g) => window.removeEventListener(g, play));
    };
  }, []);

  return (
    <video
      ref={ref}
      aria-hidden
      autoPlay
      muted
      loop
      playsInline
      disablePictureInPicture
      disableRemotePlayback
      preload="auto"
      poster={poster}
      className="absolute inset-0 h-full w-full object-cover"
    >
      <source src={webm} type="video/webm" />
      <source src={mp4} type="video/mp4" />
    </video>
  );
}
