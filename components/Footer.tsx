"use client";

import NewsletterForm from "./NewsletterForm";
import Wordmark from "./ui/Wordmark";
import Editable from "./ui/Editable";
import { useContent } from "@/contexts/ContentContext";

const SOCIALS = [
  { key: "social.instagram", label: "Instagram", path: "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm5 5.5A4.5 4.5 0 1 0 12 16.5 4.5 4.5 0 0 0 12 7.5Zm5.2-1.7a1 1 0 1 0 0 2 1 1 0 0 0 0-2Z" },
  { key: "social.facebook", label: "Facebook", path: "M13.5 22v-8h2.7l.5-3.2h-3.2V8.8c0-.9.4-1.7 1.8-1.7h1.5V4.3S15.1 4 13.9 4C11.4 4 9.8 5.5 9.8 8.3v2.5H7V14h2.8v8h3.7Z" },
  { key: "social.threads", label: "Threads", path: "M12.2 21.5c-4.6 0-7.2-2.8-7.2-7.4V9.9c0-4.600 2.600-7.400 7.200-7.400 3.200 0 5.600 1.500 6.600 4.300l-2 .7c-.7-1.900-2.200-2.900-4.600-2.900-3.300 0-5 1.900-5 5.300v4.200c0 3.400 1.700 5.300 5 5.300 2.300 0 3.700-.8 3.700-2.300 0-1.200-1-1.900-3-2-2.400-.1-3.600-1-3.600-2.600 0-1.700 1.400-2.700 3.700-2.700 2.700 0 4.500 1.500 4.500 4.100v.8c0 3.100-2.300 4.900-5.800 4.900Z" },
];

/** Always dark, whichever theme the page is in, so the site ends on the same note it opens with. */
export default function Footer() {
  const { get, isAdmin } = useContent();
  const socials = SOCIALS.map((s) => ({ ...s, url: get(s.key) })).filter((s) => s.url);

  return (
    <footer className="dark relative isolate overflow-hidden bg-ink text-paper">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <i className="orb orb-violet drift-a -left-[10%] -top-[30%] h-[600px] w-[600px]" />
        <i className="orb orb-magenta drift-b -right-[10%] top-[10%] h-[500px] w-[500px]" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-12 px-6 pb-12 pt-20 md:grid-cols-2">
        <div>
          <Wordmark size="lg" />
          <p className="mt-4 max-w-xs text-paper/65">Founder and Senior Pastor of Gateway Nation.</p>
          {socials.length > 0 && (
            <ul className="mt-6 flex items-center gap-3">
              {socials.map((s) => (
                <li key={s.key}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-paper/20 text-paper/80 transition-colors hover:border-paper/60 hover:text-paper"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d={s.path} />
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          )}
          {isAdmin && (
            <p className="mt-4 flex flex-wrap gap-2 text-xs">
              {SOCIALS.map((s) => (
                <EditLink key={s.key} k={s.key} label={`Edit ${s.label} link`} />
              ))}
            </p>
          )}
        </div>

        <div className="md:justify-self-end">
          <Editable k="newsletter.heading" as="p" className="mb-2 block font-display text-xl font-semibold" />
          <Editable k="newsletter.body" as="p" className="mb-5 block max-w-sm text-paper/65" />
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-paper/10">
        <p className="py-6 text-center text-xs text-paper/50">© {new Date().getFullYear()} Akintola Samuel. All rights reserved.</p>
      </div>
    </footer>
  );
}

function EditLink({ k, label }: { k: string; label: string }) {
  const { openEditor } = useContent();
  return (
    <button onClick={() => openEditor(k)} className="rounded-full bg-paper px-3 py-1 font-medium text-ink">
      {label}
    </button>
  );
}
