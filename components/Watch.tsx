"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { parseYouTubeId, ytEmbed } from "@/lib/youtube";
import Reveal from "./ui/Reveal";
import Editable from "./ui/Editable";

/**
 * The welcome video from Site settings.
 * Accepts a YouTube link (e.g. youtu.be or youtube.com/watch?v=...),
 * an uploaded video file, or an MP4 link.
 * If empty, the entire section is hidden.
 */
export default function Watch() {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<{ hero_video_url?: string }>("/settings")
      .then((s) => setUrl(s.hero_video_url || ""))
      .catch(() => setUrl(""));
  }, []);

  // While settings are loading, or if empty, hide the section completely.
  if (url === null || !url.trim() || url === "none") return null;

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
          <div className="overflow-hidden rounded-xl bg-ink aspect-video w-full">
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
