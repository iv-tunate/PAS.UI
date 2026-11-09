"use client";

import { useEffect, useState } from "react";
import SectionIntro from "./ui/SectionIntro";
import Button from "./ui/Button";
import Reveal from "./ui/Reveal";

const STORAGE_KEY = "study-journal-note";

const points = [
  { title: "Write while you listen", body: "Takeaways, prayers and next steps are easier to keep when you put them down as you go." },
  { title: "Private by design", body: "The note is saved in this browser only. It is never sent to a server." },
];

export default function StudyJournal() {
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setNote(stored);
    } catch {}
  }, []);

  function handleSave() {
    try {
      localStorage.setItem(STORAGE_KEY, note);
      setSaved(true);
      setTimeout(() => setSaved(false), 1800);
    } catch {}
  }

  const words = note.trim() ? note.trim().split(/\s+/).length : 0;

  return (
    <section id="journal" className="max-w-6xl mx-auto px-6 py-24 md:py-32">
      <div className="grid items-center gap-14 md:grid-cols-[1fr_1.1fr] md:gap-20">
        <div>
          <Reveal>
            <SectionIntro eyebrow="Study journal" heading="A private place for your notes" className="mb-6" />
            <p className="max-w-prose text-lg leading-relaxed text-ink/70 dark:text-paper/70">
              Keep notes next to the teaching while it is fresh. Nobody else sees them.
            </p>
          </Reveal>
          <div className="mt-10 space-y-7">
            {points.map((p, i) => (
              <Reveal key={p.title} delay={i * 90}>
                <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-1 max-w-md text-ink/65 dark:text-paper/65">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal from="right">
          {/* A notebook page: ruled lines, a margin rule, and a page that sits slightly askew. */}
          <div className="notebook relative -rotate-1 bg-paper p-6 shadow-2xl shadow-ink/20 dark:bg-ink-raised dark:shadow-black/50 md:p-8">
            <div className="mb-3 flex items-baseline justify-between">
              <h3 className="font-display text-lg font-semibold">My notes</h3>
              <span className="text-xs tabular-nums text-ink/50 dark:text-paper/50">{words} words</span>
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What stood out to you today?"
              aria-label="Journal note"
              className="notebook-lines block min-h-[15rem] w-full resize-none bg-transparent pl-6 text-base outline-none placeholder:text-ink/35 dark:placeholder:text-paper/35"
            />
            <div className="mt-5 flex items-center justify-between gap-4">
              <p className="text-xs text-ink/50 dark:text-paper/50">Stored on this device only.</p>
              <Button onClick={handleSave} variant="primary">
                {saved ? "Saved" : "Save note"}
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
