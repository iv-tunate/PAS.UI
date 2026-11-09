"use client";

import { useEffect, useRef } from "react";

/**
 * A statement that reads itself in as you scroll: each word moves from
 * faint to full strength in order, tied to scroll position rather than
 * a timer. Opacity only, written straight to the DOM in one rAF so React
 * never re-renders while scrolling. Under reduced motion all words are
 * simply fully visible.
 */
export default function ScrollWords({ text }: { text: string }) {
  const root = useRef<HTMLSpanElement>(null);
  const words = text.split(/\s+/).filter(Boolean);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const spans = Array.from(el.children) as HTMLElement[];
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      spans.forEach((s) => (s.style.opacity = "1"));
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the block's top enters at 85% of the screen, 1 when it has reached 30%.
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (vh * 0.55)));
      const lit = p * spans.length;
      spans.forEach((s, i) => {
        s.style.opacity = String(0.18 + 0.82 * Math.min(1, Math.max(0, lit - i)));
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [text]);

  return (
    <span ref={root}>
      {words.map((w, i) => (
        <span key={i} style={{ opacity: 0.18, transition: "opacity 0.15s linear" }}>
          {w}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  );
}
