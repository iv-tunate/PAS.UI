"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useContent } from "@/contexts/ContentContext";
import { useAboutPhotos } from "@/lib/pastor-photos";
import { useSlideshow } from "@/lib/use-slideshow";
import Slideshow from "./ui/Slideshow";
import Editable from "./ui/Editable";
import EditPhotosButton from "./ui/EditPhotosButton";
import Reveal from "./ui/Reveal";
import Button from "./ui/Button";

type Settings = {
  campuses_count?: string;
  years_leadership?: string;
  continents_reached?: string;
  contact_email?: string;
};

const FACTS = [
  { key: "about.fact.role", label: "Role" },
  { key: "about.fact.church", label: "Church" },
  { key: "about.fact.also", label: "Also" },
  { key: "about.fact.married", label: "Married to" },
];

export default function About() {
  const { get, isAdmin, openEditor } = useContent();
  const photos = useAboutPhotos(900);
  const photoCount = photos.length;
  const { index, go } = useSlideshow(photoCount, 4000);
  const [settings, setSettings] = useState<Settings>({});

  useEffect(() => {
    api.get<Settings>("/settings").then(setSettings).catch(() => {});
  }, []);

  const name = `${get("hero.first")} ${get("hero.last")}`.trim();
  const roles = get("about.roles").split(",").map((r) => r.trim()).filter(Boolean);

  const stats = [
    { n: settings.years_leadership, l: "years in ministry" },
    { n: settings.campuses_count, l: "campuses" },
    { n: settings.continents_reached, l: "continents reached" },
  ].filter((s) => s.n && s.n.trim());

  return (
    <section id="about" className="max-w-6xl mx-auto px-6 py-24 md:py-32 scroll-mt-16">
      <div className="grid md:grid-cols-[minmax(0,420px)_1fr] gap-12 md:gap-20 items-start">
        <Reveal from="left">
          <div className="relative md:sticky md:top-28">
            <div
              className="zoom-frame"
              style={{ clipPath: "polygon(28px 0, 100% 0, 100% calc(100% - 28px), calc(100% - 28px) 100%, 0 100%, 0 28px)" }}
            >
              <div className="relative aspect-[4/5] w-full bg-ink">
                <Slideshow photos={photos} index={index} alt={`Portrait of ${name}`} />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
              {photoCount > 1 &&
                photos.map((_, i) => (
                  <button key={i} onClick={() => go(i)} aria-label={`Show photo ${i + 1}`} className="py-2">
                    <span
                      className={`block h-[3px] rounded-full transition-all duration-500 ${
                        i === index ? "w-10 bg-brand-gradient" : "w-4 bg-ink/20 dark:bg-paper/25"
                      }`}
                    />
                  </button>
                ))}
              <EditPhotosButton set="about" className="ml-auto" />
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <p className="mb-3 text-lg text-brand-violet dark:text-brand-sky">About</p>
            <Editable
              k="about.heading"
              as="h2"
              className="font-display font-semibold text-3xl md:text-5xl max-w-xl text-ink dark:text-paper"
            />
            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 font-display font-semibold text-lg text-ink/50 dark:text-paper/50">
              {/* {roles.map((r) => (
                <span key={r}>{r}.</span>
              ))}
              {isAdmin && (
                <button
                  onClick={() => openEditor("about.roles")}
                  className="rounded-full bg-ink px-3 py-1 font-body text-xs font-medium text-paper dark:bg-paper dark:text-ink"
                >
                  Edit roles
                </button>
              )} */}
            </div>
          </Reveal>

          <Reveal delay={80}>
            <Editable
              k="about.bio"
              as="div"
              paragraphs
              className="mt-1 block max-w-prose text-lg leading-relaxed text-ink/75 dark:text-paper/75 space-y-5"
            />
          </Reveal>

          {/* <Reveal delay={110}>
            <dl className="mt-10 grid sm:grid-cols-2 gap-x-10 gap-y-5 max-w-xl border-t border-ink/10 dark:border-paper/10 pt-8">
              {FACTS.map((f) => (
                <div key={f.key}>
                  <dt className="text-sm text-brand-violet dark:text-brand-sky">{f.label}</dt>
                  <dd className="mt-1 font-display font-semibold">
                    <Editable k={f.key} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal> */}

          {stats.length > 0 && (
            <Reveal delay={120}>
              <dl className="mt-10 grid grid-cols-3 gap-6 max-w-lg border-t border-ink/10 dark:border-paper/10 pt-8">
                {stats.map((s) => (
                  <div key={s.l}>
                    <dd className="font-display font-semibold text-4xl text-brand-violet dark:text-brand-sky">{s.n}</dd>
                    <dt className="text-sm text-ink/60 dark:text-paper/60 mt-1">{s.l}</dt>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}

          {/* <Reveal delay={160}>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button href="https://gatewaynation.org" external variant="primary">
                Visit Gateway Nation
              </Button>
              {settings.contact_email && (
                <Button href={`mailto:${settings.contact_email}`} external variant="outline">
                  Get in touch
                </Button>
              )}
            </div>
          </Reveal> */}
        </div>
      </div>
    </section>
  );
}
