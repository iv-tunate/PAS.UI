"use client";

import { useEffect, useState } from "react";
import type { Photo } from "@/lib/pastor-photos";

/**
 * Stacked, cross-fading photos with a slow push-in on the one showing.
 * Fills whatever positioned parent it sits in. Only opacity and
 * transform animate.
 */
export default function Slideshow({
  photos,
  index,
  alt = "",
  push = true,
}: {
  photos: Photo[];
  index: number;
  alt?: string;
  push?: boolean;
}) {
  // Wait one frame before pushing in, otherwise the first photo
  // mounts already zoomed and never animates.
  const [ready, setReady] = useState(false);
  // Only the visible photo and the next one are requested; the rest
  // load as the slideshow reaches them. Six full-size photos at once
  // would be wasted bandwidth for most visitors.
  const [wanted, setWanted] = useState<Set<number>>(() => new Set([0, 1]));
  useEffect(() => {
    if (photos.length === 0) return;
    setWanted((prev) => {
      const next = new Set(prev);
      next.add(index);
      next.add((index + 1) % photos.length);
      return next.size === prev.size ? prev : next;
    });
  }, [index, photos.length]);
  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div className="absolute inset-0">
      {photos.map((p, i) => {
        const active = photos.length > 0 && i === (index % photos.length);
        if (!wanted.has(i)) return null;
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={`${i}-${p.src}`}
            src={p.src}
            alt={active ? alt : ""}
            aria-hidden={active ? undefined : true}
            onError={(e) => {
              const img = e.currentTarget;
              if (img.dataset.fallback !== "1") {
                img.dataset.fallback = "1";
                img.src = p.fallback;
              }
            }}
            className="slide-img absolute inset-0 h-full w-full object-cover object-[center_30%]"
            style={{
              opacity: active ? 1 : 0,
              transform: push && ready && active ? "scale(1.08)" : "scale(1)",
              transition: active
                ? "opacity 1.4s ease, transform 9s linear"
                : "opacity 1.4s ease, transform 0s linear 1.4s",
            }}
          />
        );
      })}
    </div>
  );
}
