"use client";

import { useState, type FormEvent } from "react";
import { api, ApiError } from "@/lib/api";
import Reveal from "./ui/Reveal";
import Editable from "./ui/Editable";
import Button from "./ui/Button";
import Backdrop from "./ui/Backdrop";

type Topic = "message" | "appointment" | "prayer";
const TOPICS: { id: Topic; label: string }[] = [
  { id: "message", label: "Send a message" },
  { id: "appointment", label: "Book an appointment" },
  // { id: "prayer", label: "Request prayer" },
];

const input =
  "w-full border border-ink/20 bg-transparent px-3 py-2.5 text-base outline-none focus:border-brand-violet dark:border-paper/20 dark:focus:border-brand-sky";

export default function Contact() {
  const [topic, setTopic] = useState<Topic>("message");
  const [f, setF] = useState({ name: "", email: "", phone: "", preferred_time: "", body: "", website: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF((p) => ({ ...p, [k]: e.target.value }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api.post("/contact", { topic, ...f, preferred_time: topic === "appointment" ? f.preferred_time : "" });
      setDone(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not send your message. Please try again.");
    }
    setBusy(false);
  }

  return (
    <Backdrop variant="aurora-a">
      <section id="contact" className="mx-auto grid max-w-6xl scroll-mt-16 gap-14 px-6 py-24 md:grid-cols-[1fr_1.2fr] md:gap-20 md:py-32">
        <Reveal>
          <p className="mb-3 text-sm text-brand-violet dark:text-brand-sky">Contact</p>
          <Editable k="contact.heading" as="h2" className="font-display text-3xl font-semibold md:text-5xl" />
          <Editable k="contact.body" as="p" className="mt-6 block max-w-prose text-lg leading-relaxed text-ink/70 dark:text-paper/70" />
        </Reveal>

        <Reveal delay={100}>
          {done ? (
            <div className="border border-ink/15 p-8 dark:border-paper/15" role="status">
              <p className="font-display text-2xl font-semibold">Thank you, your message is on its way.</p>
              <p className="mt-3 text-ink/70 dark:text-paper/70">We will get back to you by email or phone as soon as we can.</p>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-5">
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="What is this about?">
                {TOPICS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={topic === t.id}
                    onClick={() => setTopic(t.id)}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      topic === t.id
                        ? "border-transparent bg-ink text-paper dark:bg-paper dark:text-ink"
                        : "border-ink/20 hover:border-ink/40 dark:border-paper/20 dark:hover:border-paper/40"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <label className="block text-sm">
                  Your name
                  <input required minLength={2} maxLength={100} autoComplete="name" value={f.name} onChange={set("name")} className={`${input} mt-1.5`} />
                </label>
                <label className="block text-sm">
                  Phone number
                  <input required type="tel" maxLength={30} autoComplete="tel" value={f.phone} onChange={set("phone")} className={`${input} mt-1.5`} />
                </label>
              </div>
              <label className="block text-sm">
                Email address
                <input required type="email" maxLength={200} autoComplete="email" value={f.email} onChange={set("email")} className={`${input} mt-1.5`} />
              </label>
              {topic === "appointment" && (
                <label className="block text-sm">
                  When would suit you?
                  <input maxLength={120} placeholder="For example, a weekday afternoon" value={f.preferred_time} onChange={set("preferred_time")} className={`${input} mt-1.5`} />
                </label>
              )}
              <label className="block text-sm">
                {topic === "appointment" ? "What would you like to talk about?" : topic === "prayer" ? "Your prayer request" : "Your message"}
                <textarea required rows={5} maxLength={4000} value={f.body} onChange={set("body")} className={`${input} mt-1.5 leading-relaxed`} />
              </label>

              {/* Bot trap: invisible to people, tempting to scripts. */}
              <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                <label>
                  Website
                  <input tabIndex={-1} autoComplete="off" value={f.website} onChange={set("website")} />
                </label>
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-600 dark:text-red-400">
                  {error}
                </p>
              )}
              <Button type="submit" disabled={busy}>
                {busy ? "Sending…" : topic === "appointment" ? "Request appointment" : "Send"}
              </Button>
            </form>
          )}
        </Reveal>
      </section>
    </Backdrop>
  );
}
