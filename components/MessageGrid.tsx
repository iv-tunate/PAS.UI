"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DEMO_MESSAGES, SHOW_DEMO_CONTENT, isDemoId, type DemoMessage } from "@/lib/demo-content";
import { longDate } from "@/lib/format";
import { ytEmbed, ytThumb } from "@/lib/youtube";
import { useContent } from "@/contexts/ContentContext";
import Reveal from "./ui/Reveal";
import SampleBadge from "./ui/SampleBadge";
import AdminHint from "./ui/AdminHint";


export default function MessageGrid() {
  const { get } = useContent();
  const [messages, setMessages] = useState<DemoMessage[] | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);

  const ytUrl = get("social.youtube") || "https://www.youtube.com/@akintolasamuel";

  useEffect(() => {
    let active = true;

    async function load() {
      // 1. Attempt to fetch live uploads directly from YouTube channel
      try {
        if (ytUrl) {
          const res = await fetch(`/api/youtube?channel_url=${encodeURIComponent(ytUrl)}`);
          if (res.ok) {
            const data = await res.json();
            if (active && data?.ok && Array.isArray(data.videos) && data.videos.length > 0) {
              setMessages(data.videos);
              return;
            }
          }
        }
      } catch {
        // Fallback to database messages
      }

      // 2. Fallback to messages stored in the database
      try {
        const dbMessages = await api.get<DemoMessage[]>("/messages");
        if (active) {
          setMessages(dbMessages || []);
        }
      } catch {
        if (active) setMessages([]);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [ytUrl]);

  if (!messages) return <p className="text-sm text-ink/60 dark:text-paper/60">Loading messages…</p>;
  const list = messages.length > 0 ? messages : SHOW_DEMO_CONTENT ? DEMO_MESSAGES : [];

  return (
    <div className="space-y-10">
      {/* YouTube Channel Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-4 backdrop-blur-sm dark:border-red-500/30 dark:bg-red-950/20">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-red-600 text-white shadow-md">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
          </span>
          <div>
            <p className="font-display font-semibold text-sm md:text-base">Akintola Samuel on YouTube</p>
            <p className="text-xs text-ink/60 dark:text-paper/60">
              New sermons and live services update automatically
            </p>
          </div>
        </div>
        <a
          href={ytUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-red-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700"
        >
          <span>Subscribe on YouTube</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>

      {list.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-ink/65 dark:text-paper/65">New messages are coming soon.</p>
          <div className="mt-6">
            <AdminHint title="No messages yet" href="/admin/messages" action="Add a message">
              Paste a YouTube link and a title. It shows up here as a thumbnail.
            </AdminHint>
          </div>
        </div>
      ) : (
        <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 2xl:grid-cols-3">
          {list.map((m, i) => (
            <Reveal key={m.id} delay={(i % 2) * 80}>
              <article className="group flex h-full flex-col">
                <div className="relative aspect-video overflow-hidden rounded-xl bg-ink shadow-lg">
                  {playing === m.id ? (
                    <iframe
                      src={ytEmbed(m.youtube_id)}
                      title={m.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                      className="absolute inset-0 h-full w-full"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPlaying(m.id)}
                      aria-label={`Play: ${m.title}`}
                      className="group absolute inset-0 block w-full overflow-hidden text-left"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={ytThumb(m.youtube_id)}
                        alt=""
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/75 via-transparent to-transparent" />
                      <span
                        aria-hidden
                        className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper/95 text-ink shadow-xl transition-transform duration-300 group-hover:scale-110"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-1 text-red-600">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </span>
                      {isDemoId(m.id) && <SampleBadge className="absolute left-3 top-3" />}
                    </button>
                  )}
                </div>
                <div className="mt-4 flex flex-1 flex-col justify-between">
                  <div>
                    <h2 className="font-display text-lg font-semibold leading-snug group-hover:text-brand-sky transition-colors">
                      {m.title}
                    </h2>
                    {m.preached_on && (
                      <p className="mt-1 text-xs text-ink/55 dark:text-paper/55">{longDate(m.preached_on)}</p>
                    )}
                    {m.description && (
                      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/65 dark:text-paper/65">
                        {m.description}
                      </p>
                    )}
                  </div>
                  <div className="mt-4 pt-2">
                    <a
                      href={`https://www.youtube.com/watch?v=${m.youtube_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-sky hover:underline"
                    >
                      <span>Watch on YouTube</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
