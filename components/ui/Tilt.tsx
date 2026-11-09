"use client";

import { useRef, type ReactNode } from "react";

/**
 * Cards lean toward the pointer in 3D. Mouse and pen only: touch
 * devices get a plain card, and anyone who asked for reduced motion
 * gets one too.
 */
export default function Tilt({
  children,
  className = "",
  max = 6,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const el = useRef<HTMLDivElement>(null);

  function move(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch" || !el.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.current.style.transform = `rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateZ(0)`;
  }

  function leave() {
    if (el.current) el.current.style.transform = "";
  }

  return (
    <div className={className} style={{ perspective: 900 }}>
      <div
        ref={el}
        onPointerMove={move}
        onPointerLeave={leave}
        className="h-full transition-transform duration-300 ease-out will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}
