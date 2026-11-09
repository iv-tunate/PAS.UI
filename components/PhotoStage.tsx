"use client";

import { useEffect, useRef, useState } from "react";
import { useStagePhotos } from "@/lib/pastor-photos";
import EditPhotosButton from "./ui/EditPhotosButton";
import { useSlideshow } from "@/lib/use-slideshow";

const SLIDE_MS = 3800;

/**
 * One photo, whole screen. If multiple photos exist, it changes on its own,
 * and a tap, click, swipe or arrow key changes it too.
 * If only 1 photo exists, it remains static without transitions or pointer cursor.
 */
export default function PhotoStage() {
  const photos = useStagePhotos(1600);
  const count = photos.length;
  const { index, go } = useSlideshow(count, SLIDE_MS);
  const [prev, setPrev] = useState<number | null>(null);
  const [origin, setOrigin] = useState({ x: 50, y: 50 });
  const shown = useRef(0);
  const touchX = useRef<number | null>(null);

  // Warm the browser cache with the next photo so the reveal never waits on the network.
  useEffect(() => {
    if (count < 2) return;
    const next = photos[(index + 1) % count];
    if (next) new window.Image().src = next.src;
  }, [index, photos, count]);

  // Keep the outgoing photo underneath until the reveal has finished.
  useEffect(() => {
    if (count < 2) return;
    if (index === shown.current) return;
    setPrev(shown.current);
    shown.current = index;
    const t = setTimeout(() => setPrev(null), 1100);
    return () => clearTimeout(t);
  }, [index, count]);

  function advance(e: React.MouseEvent<HTMLElement>, step: 1 | -1) {
    if (count < 2) return;
    const r = e.currentTarget.getBoundingClientRect();
    setOrigin({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
    go(index + step);
  }

  function onKey(e: React.KeyboardEvent<HTMLElement>) {
    if (count < 2) return;
    if (e.key === "ArrowRight" || e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOrigin({ x: 50, y: 50 });
      go(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      setOrigin({ x: 50, y: 50 });
      go(index - 1);
    }
  }

  function layer(i: number, animate: boolean) {
    const p = photos[i];
    if (!p) return null;
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={animate ? `cur-${i}-${index}` : `old-${i}`}
        src={p.src}
        alt=""
        draggable={false}
        onError={(e) => {
          const img = e.currentTarget;
          if (img.dataset.fallback !== "1") {
            img.dataset.fallback = "1";
            img.src = p.fallback;
          }
        }}
        className={`absolute inset-0 h-full w-full object-cover object-[center_30%] ${animate && prev !== null ? "reveal-circle" : ""}`}
        style={animate ? ({ "--x": `${origin.x}%`, "--y": `${origin.y}%` } as React.CSSProperties) : undefined}
      />
    );
  }

  return (
    <div className="relative">
      <section
        role={count > 1 ? "button" : undefined}
        tabIndex={count > 1 ? 0 : undefined}
        aria-label={count > 1 ? "Photos of Pastor Akin. Activate to see the next photo." : "Photo of Pastor Akin."}
        onClick={(e) => {
          if (count > 1) advance(e, 1);
        }}
        onKeyDown={count > 1 ? onKey : undefined}
        onTouchStart={(e) => {
          if (count > 1) touchX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (count < 2 || touchX.current === null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          touchX.current = null;
          if (Math.abs(dx) > 60) {
            setOrigin({ x: dx < 0 ? 100 : 0, y: 50 });
            go(index + (dx < 0 ? 1 : -1));
          }
        }}
        className={`relative h-[100svh] w-full select-none overflow-hidden bg-ink text-paper outline-offset-[-4px] ${
          count > 1 ? "cursor-pointer" : ""
        }`}
      >
        {prev !== null && count > 1 && layer(prev, false)}
        {layer(index, true)}

        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-ink/30" />
      </section>
      <EditPhotosButton set="pastor" className="absolute right-6 top-6 z-10" />
    </div>
  );
}
