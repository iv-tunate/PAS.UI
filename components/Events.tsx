"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { eventDateLabel } from "@/lib/format";
import { optimizedImage } from "@/lib/cloudinary";
import { useContent } from "@/contexts/ContentContext";
import { DEMO_EVENTS, SHOW_DEMO_CONTENT } from "@/lib/demo-content";
import Editable from "./ui/Editable";
import AdminHint from "./ui/AdminHint";

export type SiteEvent = {
  id: string;
  name: string;
  description: string;
  month: number;
  day_start: number;
  day_end: number;
  flyer_url: string;
  position: number;
};

const ROTATE_MS = 7000;

/** Gradient stand-ins for events with no flyer yet, so each still looks designed. */
const FALLBACKS = [
  "linear-gradient(135deg,#0f2a44 0%,#4E4F8D 55%,#9C4A78 100%)",
  "linear-gradient(135deg,#1679AC 0%,#25265a 60%,#0B0C0E 100%)",
  "linear-gradient(135deg,#9C4A78 0%,#3b2a63 55%,#0B0C0E 100%)",
  "linear-gradient(135deg,#0B0C0E 0%,#4E4F8D 60%,#1679AC 100%)",
];
const CODE_RED_GRADIENT = "linear-gradient(135deg,#35000b 0%,#c8263d 52%,#3d102f 100%)";
const UPSURGE_GRADIENT = "linear-gradient(135deg,#071c45 0%,#1679AC 55%,#25265a 100%)";

function eventGradient(name: string, index: number) {
  const normalizedName = name.toLowerCase();
  if (normalizedName.includes("code red")) return CODE_RED_GRADIENT;
  if (normalizedName.includes("upsurge")) return UPSURGE_GRADIENT;
  if (normalizedName.includes("breakthrough")) return FALLBACKS[0];
  return FALLBACKS[index % FALLBACKS.length];
}

/**
 * Events rotate automatically. On desktop, the copy sits beside the flyer;
 * on smaller screens, the flyer remains the section background.
 */
export default function Events() {
  const { isAdmin } = useContent();
  const [events, setEvents] = useState<SiteEvent[] | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    api.get<SiteEvent[]>("/events").then((e) => setEvents(e || [])).catch(() => setEvents([]));
  }, []);

  const activeEvents = events && events.length > 0 ? events : SHOW_DEMO_CONTENT ? DEMO_EVENTS : [];
  const count = activeEvents.length;
  const go = useCallback((n: number) => setIndex(((n % count) + count) % count), [count]);

  // Smooth scroll into view when hash is #events
  useEffect(() => {
    const handleHash = () => {
      if (typeof window !== "undefined" && window.location.hash === "#events") {
        const el = document.getElementById("events");
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  useEffect(() => {
    if (count < 2) return;
    const t = setTimeout(() => setIndex((i) => (i + 1) % count), ROTATE_MS);
    return () => clearTimeout(t);
  }, [index, count]);

  // Warm the next flyer so the change never waits on the network.
  useEffect(() => {
    if (count < 2) return;
    const next = activeEvents[(index + 1) % count]?.flyer_url;
    if (next) new window.Image().src = optimizedImage(next, 1600);
  }, [activeEvents, index, count]);

  if (count === 0) {
    if (!isAdmin) {
      return (
        <section id="events" className="scroll-mt-16 py-12 text-center">
          <p className="text-sm text-ink/60 dark:text-paper/60">Upcoming events will be announced soon.</p>
        </section>
      );
    }
    return (
      <section id="events" className="mx-auto max-w-6xl scroll-mt-16 px-6 py-24">
        <AdminHint title="No events yet" href="/admin/events" action="Add an event">
          Events appear here as a full-width banner with the flyer behind them.
        </AdminHint>
      </section>
    );
  }

  const ev = activeEvents[index] || activeEvents[0];
  const when = eventDateLabel(ev.month, ev.day_start, ev.day_end);
  const textOnRight = index % 2 === 1;

  return (
    <section
      id="events"
      aria-roledescription="carousel"
      aria-label="Events"
      onClick={() => count > 1 && go(index + 1)}
      className="relative isolate min-h-[34rem] scroll-mt-16 overflow-hidden bg-ink text-paper md:min-h-[40rem]"
    >
      {/* One layer per event, so they cross-fade instead of cutting. */}
      {activeEvents.map((e, i) => (
        <div
          key={e.id}
          aria-hidden
          className={`absolute inset-0 -z-20 transition-[inset,opacity] duration-1000 ease-in-out lg:inset-y-0 ${i % 2 === 1 ? "lg:left-0 lg:right-1/2" : "lg:left-1/2 lg:right-0"}`}
          style={{
            opacity: i === index ? 1 : 0,
            background: e.flyer_url ? undefined : eventGradient(e.name, i),
          }}
        >
          {e.flyer_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={optimizedImage(e.flyer_url, 1600)}
              alt=""
              loading={i === 0 ? "eager" : "lazy"}
              className={`slide-img h-full w-full object-cover ${i === index ? "scale-[1.06] lg:scale-100" : "scale-100"}`}
              style={{ transition: "transform 9s linear" }}
            />
          )}
        </div>
      ))}
      {activeEvents.map((e, i) => (
        <div
          key={`${e.id}-text-gradient`}
          aria-hidden
          className={`absolute inset-y-0 -z-10 hidden transition-[inset,opacity] duration-1000 ease-in-out lg:block ${i % 2 === 1 ? "lg:left-1/2 lg:right-0" : "lg:left-0 lg:right-1/2"}`}
          style={{ opacity: i === index ? 1 : 0, background: eventGradient(e.name, i) }}
        />
      ))}
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-ink/90 via-ink/45 to-ink/60 lg:bg-gradient-to-r lg:from-ink/70 lg:via-ink/35 lg:to-ink/10" />

      <div className="mx-auto flex min-h-[34rem] max-w-6xl flex-col px-6 py-14 md:min-h-[40rem] md:py-20 lg:flex-row lg:items-stretch">
        <div
          className={`flex min-h-0 w-full flex-1 flex-col justify-between transition-all duration-1000 ease-in-out lg:w-1/2 lg:flex-none ${
            textOnRight ? "lg:translate-x-full lg:pl-12" : "lg:pr-12"
          }`}
        >
          <p className="text-sm text-brand-sky">
            <Editable k="events.heading" />
          </p>

          <div key={ev.id} className="hero-enter max-w-xl text-left my-auto">
            {when && (
              <p className="mb-4 inline-block rounded-full border border-paper/40 bg-ink/40 px-4 py-1.5 font-display text-sm font-semibold backdrop-blur-sm">
                {when}
              </p>
            )}
            <h2 className="font-display text-4xl font-extrabold leading-[1.02] md:text-7xl">{ev.name}</h2>
            {ev.description && <p className="mt-5 max-w-xl text-lg leading-relaxed text-paper/80">{ev.description}</p>}
          </div>

          <div className="flex items-center justify-between gap-6 pt-4">
            <div className="flex items-center gap-2" role="tablist" aria-label="Choose an event">
              {activeEvents.map((e, i) => (
                <button
                  key={e.id}
                  role="tab"
                  aria-selected={i === index}
                  aria-label={e.name}
                  onClick={(evt) => {
                    evt.stopPropagation();
                    go(i);
                  }}
                  className="py-3"
                >
                  <span className={`block h-[3px] rounded-full transition-all duration-500 ${i === index ? "w-12 bg-brand-gradient" : "w-5 bg-paper/35"}`} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
