"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { parseYouTubeId, ytEmbed } from "@/lib/youtube";
import { useContent } from "@/contexts/ContentContext";
import Reveal from "./ui/Reveal";
import Editable from "./ui/Editable";

/**
 * The welcome video from Site settings.
 * Accepts a YouTube link (e.g. youtu.be or youtube.com/watch?v=...),
 * an uploaded video file, or an MP4 link.
 * If empty, the section is hidden for visitors, but displays an admin notice when logged in.
 */
export default function Watch() {
  const [url, setUrl] = useState<string | null>(null);
  const { isAdmin } = useContent();

  useEffect(() => {
    api
      .get<{ hero_video_url?: string }>("/settings")
      .then((s) => setUrl(s.hero_video_url || ""))
      .catch(() => setUrl(""));
  }, []);

  // While loading
  if (url === null) return null;

  const hasVideo = Boolean(url.trim() && url !== "none");

  // If empty and not admin, hide completely
  if (!hasVideo && !isAdmin) return null;

  // Admin banner when empty
  if (!hasVideo && isAdmin) {
    return (
      <section className="relative mx-auto max-w-5xl px-6 py-8">
        <div className="rounded-2xl border-2 border-dashed border-ink/20 dark:border-paper/20 p-6 sm:p-8 text-center bg-paper/30 dark:bg-ink/30">
          <span className="inline-block rounded-full bg-brand-sky/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-sky">
            Admin Preview
          </span>
          <h3 className="mt-2 font-display text-lg font-semibold text-ink dark:text-paper">
            Welcome Video section is hidden
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-ink/60 dark:text-paper/60 max-w-md mx-auto">
            This section is hidden from regular visitors because no video is active yet.
          </p>
          <Link
            href="/admin/settings"
            className="mt-4 inline-block rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-paper dark:bg-paper dark:text-ink hover:opacity-90 transition-opacity"
          >
            Add video in Settings →
          </Link>
        </div>
      </section>
    );
  }

  const ytId = parseYouTubeId(url);

  return (
    <section className="relative mx-auto max-w-5xl px-6 py-20 md:py-28">
      <Reveal>
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-brand-sky">
          Welcome Video
        </span>
        <Editable k="watch.heading" as="h2" className="mt-2 block font-display text-3xl font-semibold md:text-4xl" />
        <Editable k="watch.body" as="p" className="mb-8 mt-3 block max-w-prose text-base md:text-lg text-ink/70 dark:text-paper/70" />
      </Reveal>
      <Reveal from="scale">
        <div className="relative rounded-2xl p-1 bg-gradient-to-tr from-brand-sky/20 via-brand-violet/20 to-brand-magenta/20 shadow-2xl">
          <div className="overflow-hidden rounded-xl bg-ink aspect-[4/5] md:aspect-video w-full flex items-center justify-center">
            {ytId ? (
              <iframe
                src={ytEmbed(ytId)}
                title="Welcome Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                className="h-full w-full"
              />
            ) : (
              <video src={url} controls playsInline preload="metadata" className="h-full w-full object-cover" />
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
