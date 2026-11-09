"use client";

import { useEffect, useRef } from "react";
import Button from "./ui/Button";
import Editable from "./ui/Editable";
import { useContent } from "@/contexts/ContentContext";
import { useHeroPhoto } from "@/lib/pastor-photos";

export default function Hero() {
  const photoLayer = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const heroPhoto = useHeroPhoto();
  const { isAdmin, openEditor, openPhotos } = useContent();

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / window.innerHeight));
      if (photoLayer.current) {
        photoLayer.current.style.transform = `translate3d(0, ${p * 70}px, 0) scale(${1 + p * 0.06})`;
      }
      if (content.current) {
        content.current.style.transform = `translate3d(0, ${-p * 60}px, 0)`;
        content.current.style.opacity = String(Math.max(0, 1 - p * 1.4));
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative isolate overflow-hidden bg-ink text-paper min-h-[calc(100svh-4.25rem)] flex">
      <div ref={photoLayer} className="absolute inset-0 -z-20 will-change-transform">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroPhoto.src}
          alt="Pastor Akintola Samuel"
          onError={(e) => {
            const img = e.currentTarget;
            if (img.dataset.fallback !== "1") {
              img.dataset.fallback = "1";
              img.src = heroPhoto.fallback;
            }
          }}
          className="h-full w-full object-cover object-[center_30%]"
        />
      </div>

      {/* Bottom readability scrim: fades cleanly into ink only at the base where text sits, leaving 70% of the photo bright & clear */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-ink/60 via-30% to-transparent pointer-events-none" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-40">
        <i className="mesh-blob mesh-a -left-[10%] top-[5%] h-[60vmin] w-[60vmin] opacity-20" style={{ background: "radial-gradient(circle, #1C98D8, transparent 70%)" }} />
        <i className="mesh-blob mesh-b right-[-8%] top-[20%] h-[60vmin] w-[60vmin] opacity-15" style={{ background: "radial-gradient(circle, #C45D96, transparent 70%)" }} />
      </div>

      <div ref={content} className="relative mx-auto flex w-full max-w-7xl flex-col items-center justify-end px-6 pb-24 pt-20 text-center md:pb-28 will-change-transform">
        {isAdmin && (
          <div className="mb-6 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-paper/70">Edit:</span>
            {[
              ["hero.role", "Line above name"],
              ["hero.first", "First name"],
              ["hero.last", "Last name"],
              ["hero.tagline", "Sentence below"],
            ].map(([key, label]) => (
              <button
                key={key}
                onClick={() => openEditor(key)}
                className="rounded-full bg-paper px-3 py-1.5 font-medium text-ink shadow-lg"
              >
                {label}
              </button>
            ))}
            <button onClick={() => openPhotos("hero")} className="rounded-full bg-paper px-3 py-1.5 font-medium text-ink shadow-lg">
              Hero image
            </button>
          </div>
        )}

        <Editable
          k="hero.role"
          as="p"
          bare
          className="hero-enter mb-6 text-base md:text-lg text-paper/85"
          style={{ animationDelay: "100ms" }}
        />

        {/* Stacked on phones; first and last name sit side by side from md up. */}
        <h1 className="flex flex-col items-center font-display font-extrabold leading-[0.88] tracking-tight text-[clamp(3.6rem,14vw,11.5rem)] md:flex-row md:flex-wrap md:justify-center md:gap-x-[0.28em] md:leading-[1] md:text-[clamp(3.5rem,11vw,10.5rem)]">
          <span className="mask-line whitespace-nowrap"><span style={{ "--d": "180ms" } as React.CSSProperties}><Editable k="hero.first" bare /></span></span>
          <span className="mask-line whitespace-nowrap">
            <span
              className="bg-brand-gradient bg-clip-text text-transparent"
              style={{ "--d": "320ms" } as React.CSSProperties}
            >
              <Editable k="hero.last" bare />
            </span>
          </span>
        </h1>

        <Editable
          k="hero.tagline"
          as="p"
          bare
          className="hero-enter mx-auto mt-8 block max-w-xl text-lg md:text-xl leading-relaxed text-paper/80"
          style={{ animationDelay: "650ms" }}
        />

        <div className="hero-enter mt-9 flex flex-wrap justify-center gap-3" style={{ animationDelay: "800ms" }}>
          {/* <Button href="/relearn" variant="primary">Start learning on Relearn</Button> */}
          {/* <Button href="/#about" variant="primary" className="!text-white !border-paper/40 hover:!border-paper">
            Meet Pastor Akin
          </Button> */}
        </div>
      </div>

    </section>
  );
}
