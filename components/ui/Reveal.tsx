"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type From = "up" | "left" | "right" | "scale";

/**
 * Scroll-triggered entrance. Transform and opacity only, replays on every visit to the block,
 * and shows everything immediately when motion is reduced.
 * Use `delay` for items that genuinely read in sequence.
 */
export default function Reveal({
  children,
  delay = 0,
  from = "up",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  from?: From;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }
    // Shows when about an eighth of the block is on screen, hides again once it
    // has fully left, so the entrance plays every time you scroll to it, up or down.
    const io = new IntersectionObserver(
      ([entry]) => {
        const tall = entry.intersectionRect.height > window.innerHeight * 0.25;
        if (entry.intersectionRatio >= 0.12 || tall) setShown(true);
        else if (!entry.isIntersecting) setShown(false);
      },
      { threshold: [0, 0.12], rootMargin: "0px 0px -8% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`reveal reveal-${from} ${shown ? "reveal-in" : ""} ${className}`}
      style={{ transitionDelay: shown ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
