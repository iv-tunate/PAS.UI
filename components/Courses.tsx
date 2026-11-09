"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DEMO_COURSE_THUMBNAIL, DEMO_COURSES, SHOW_DEMO_CONTENT, isDemoId, type DemoCourse } from "@/lib/demo-content";
import SampleBadge from "./ui/SampleBadge";
import AdminHint from "./ui/AdminHint";
import Reveal from "./ui/Reveal";
import GetButton from "./GetButton";
import { PriceTag } from "./Books";

const KIND: Record<DemoCourse["media_kind"], { label: string; icon: string }> = {
  video: { label: "Video", icon: "M8 5v14l11-7z" },
  audio: { label: "Audio", icon: "M12 3v10.55A4 4 0 1 0 14 17V7h4V3z" },
  file: { label: "Download", icon: "M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z" },
};

/** Free and paid teachings: video, audio or a file. Each shows its thumbnail, kind and price. */
export default function Courses() {
  const [courses, setCourses] = useState<DemoCourse[] | null>(null);

  useEffect(() => {
    api.get<DemoCourse[]>("/courses").then((c) => setCourses(c || [])).catch(() => setCourses([]));
  }, []);

  const list = courses && courses.length > 0 ? courses : courses && SHOW_DEMO_CONTENT ? DEMO_COURSES : [];

  return (
    <section id="teachings" className="mx-auto max-w-6xl scroll-mt-16 px-6 pb-24 md:pb-32">
      {!courses ? (
        <p className="text-sm text-ink/60 dark:text-paper/60">Loading…</p>
      ) : list.length === 0 ? (
        <>
          <p className="text-ink/65 dark:text-paper/65">New teachings are coming soon.</p>
          <div className="mt-6">
            <AdminHint title="No teachings published yet" href="/admin/courses" action="Add a teaching">
              Add a video, audio or file, choose free or paid, and it appears here.
            </AdminHint>
          </div>
        </>
      ) : (
        <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((c, i) => {
            const kind = KIND[c.media_kind] ?? KIND.file;
            return (
              <Reveal key={c.id} delay={(i % 3) * 80}>
                <article className="group flex h-full flex-col">
                  <div className="zoom-frame relative aspect-video overflow-hidden bg-ink">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.thumbnail_url || DEMO_COURSE_THUMBNAIL}
                      alt=""
                      loading="lazy"
                      onError={(e) => {
                        if (e.currentTarget.dataset.fb !== "1") {
                          e.currentTarget.dataset.fb = "1";
                          e.currentTarget.src = DEMO_COURSE_THUMBNAIL;
                        }
                      }}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-medium text-paper backdrop-blur-sm">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d={kind.icon} />
                      </svg>
                      {kind.label}
                    </span>
                    {isDemoId(c.id) && <SampleBadge className="absolute right-3 top-3" />}
                  </div>
                  <h3 className="mt-5 font-display text-xl font-semibold">{c.title}</h3>
                  {c.summary && <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/65 dark:text-paper/65">{c.summary}</p>}
                  {c.chapters?.length > 0 && (
                    <details className="mt-3 text-sm text-ink/65 dark:text-paper/65">
                      <summary className="cursor-pointer text-brand-violet dark:text-brand-sky">What is inside ({c.chapters.length})</summary>
                      <ol className="mt-2 list-decimal space-y-1 pl-5">
                        {c.chapters.map((ch) => (
                          <li key={ch.position}>{ch.title}</li>
                        ))}
                      </ol>
                    </details>
                  )}
                  <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                    <PriceTag item={c} />
                    <GetButton
                      item={{ kind: "course", id: c.id, title: c.title, is_free: c.is_free, price_kobo: c.price_kobo, price_usd_cents: c.price_usd_cents }}
                      label={c.is_free ? "Get it free" : "Buy"}
                    />
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      )}
    </section>
  );
}
