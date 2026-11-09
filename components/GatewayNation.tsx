"use client";

import { useEffect, useRef } from "react";
import Button from "./ui/Button";
import Reveal from "./ui/Reveal";
import Editable from "./ui/Editable";
import Slideshow from "./ui/Slideshow";
import EditPhotosButton from "./ui/EditPhotosButton";
import { useChurchPhotos } from "@/lib/pastor-photos";
import { useSlideshow } from "@/lib/use-slideshow";
import { CHURCH_PHOTO_COUNT } from "@/lib/content-defaults";

/**
 * "This is home": full-bleed inverted band with a slideshow of the church.
 * A soft light follows the pointer across it (mouse only).
 */
export default function GatewayNation() {
  const band = useRef<HTMLElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const photos = useChurchPhotos();
  const count = photos.length;
  const { index, go } = useSlideshow(count, 4500);

  useEffect(() => {
    const el = band.current;
    if (!el) return;
    let raf = 0;
    let x = 0;
    let y = 0;
    const paint = () => {
      raf = 0;
      if (glow.current) glow.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(paint);
    };
    el.addEventListener("pointermove", move);
    return () => {
      el.removeEventListener("pointermove", move);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={band} className="relative isolate overflow-hidden bg-ink text-paper dark:bg-paper dark:text-ink">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <i className="orb orb-sky drift-a -left-[10%] -top-[40%] h-[700px] w-[700px]" />
        <i className="orb orb-magenta drift-b -right-[8%] -bottom-[50%] h-[700px] w-[700px]" />
        <div
          ref={glow}
          className="absolute left-0 top-0 h-[520px] w-[520px] rounded-full will-change-transform"
          style={{ background: "radial-gradient(circle, rgba(109,111,196,0.35), transparent 65%)", transform: "translate(-50%, -50%) translate(50vw, 40%)" }}
        />
      </div>
      <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 py-24 md:grid-cols-[1.1fr_1fr] md:gap-16 md:py-36">
        <Reveal from="left">
          <p className="mb-4 text-sm text-brand-sky dark:text-brand-violet">Gateway Nation</p>
          <Editable k="gateway.heading" as="h2" className="font-display text-4xl font-extrabold leading-[1.02] md:text-6xl" />
          <Editable k="gateway.body" as="p" className="mt-7 block max-w-prose text-lg leading-relaxed opacity-75" />
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href="https://gatewaynation.org" external variant="primary">
              Visit Gateway Nation
            </Button>
            {/* <Button href="/messages" variant="outline" className="!border-current/40 !text-inherit">
              Messages
            </Button> */}
          </div>
        </Reveal>

        <Reveal from="right" delay={120}>
          <div
            className="zoom-frame"
            style={{ clipPath: "polygon(28px 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%, 0 28px)" }}
          >
            <div className="relative aspect-[4/3] w-full bg-ink">
              <Slideshow photos={photos} index={index} alt="Life at Gateway Nation" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            {count > 1 &&
              photos.map((_, i) => (
                <button key={i} onClick={() => go(i)} aria-label={`Show photo ${i + 1}`} className="py-2">
                  <span
                    className={`block h-[3px] rounded-full transition-all duration-500 ${
                      i === index ? "w-10 bg-brand-gradient" : "w-4 bg-current opacity-30"
                    }`}
                  />
                </button>
              ))}
            <EditPhotosButton set="church" className="ml-auto" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
