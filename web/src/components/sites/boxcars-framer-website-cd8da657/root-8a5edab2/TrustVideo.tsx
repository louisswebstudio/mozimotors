"use client";

import { useRef, useState } from "react";
import { Play } from "lucide-react";

/** Muted looping story video with a centered play button that fades out while playing. */
export function TrustVideo({ src, playLabel }: { src: string; playLabel: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const v = ref.current;
    if (!v) return;
    v.play().then(
      () => setPlaying(true),
      () => setPlaying(false),
    );
  };
  const pause = () => {
    ref.current?.pause();
    setPlaying(false);
  };

  return (
    <div className="relative h-[371px] flex-1 overflow-hidden rounded-t-2xl bxt:h-[650px] bxt:rounded-s-2xl bxt:rounded-se-none">
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        onClick={playing ? pause : undefined}
        onPause={() => setPlaying(false)}
        className={`absolute inset-0 size-full object-cover ${playing ? "cursor-pointer" : ""}`}
      />
      <button
        type="button"
        aria-label={playLabel}
        onClick={play}
        tabIndex={playing ? -1 : 0}
        aria-hidden={playing}
        className={`absolute left-1/2 top-1/2 grid size-[60px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white transition-opacity duration-300 ${
          playing ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
      >
        <Play size={24} strokeWidth={1.5} color="#050B20" className="translate-x-[2px]" aria-hidden />
      </button>
    </div>
  );
}
