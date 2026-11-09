"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DEMO_BOOK_COVER, DEMO_BOOKS, SHOW_DEMO_CONTENT, isDemoId, type DemoBook } from "@/lib/demo-content";
import { priceLabel } from "@/lib/format";
import { useContent } from "@/contexts/ContentContext";
import SampleBadge from "./ui/SampleBadge";
import SectionIntro from "./ui/SectionIntro";
import Editable from "./ui/Editable";
import AdminHint from "./ui/AdminHint";
import Button from "./ui/Button";
import Tilt from "./ui/Tilt";
import Reveal from "./ui/Reveal";
import GetButton from "./GetButton";

type Book = DemoBook;

/** Free-or-paid tag. Free is the louder one, since it is the easy yes. */
export function PriceTag({ item, className = "" }: { item: Parameters<typeof priceLabel>[0]; className?: string }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
        item.is_free ? "bg-brand-gradient-solid text-white" : "border border-ink/20 dark:border-paper/25"
      } ${className}`}
    >
      {priceLabel(item)}
    </span>
  );
}

/** A book standing on its own: soft shadow and a lit spine edge. */
function Cover({ book }: { book: Book }) {
  return (
    <div className="book-cover relative">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={book.cover_image_url || DEMO_BOOK_COVER}
        alt={`Cover of ${book.title}`}
        loading="lazy"
        onError={(e) => {
          if (e.currentTarget.dataset.fb !== "1") {
            e.currentTarget.dataset.fb = "1";
            e.currentTarget.src = DEMO_BOOK_COVER;
          }
        }}
        className="aspect-[3/4] w-full object-cover"
      />
      {isDemoId(book.id) && <SampleBadge className="absolute left-3 top-3 z-10" />}
    </div>
  );
}

const asBuyable = (b: Book) => ({ kind: "book" as const, id: b.id, title: b.title, is_free: b.is_free, price_kobo: b.price_kobo, price_usd_cents: b.price_usd_cents });

export function useBooks() {
  const [books, setBooks] = useState<Book[] | null>(null);
  useEffect(() => {
    api.get<Book[]>("/books").then((b) => setBooks(b || [])).catch(() => setBooks([]));
  }, []);
  const real = books ?? [];
  const list = real.length > 0 ? real : books && SHOW_DEMO_CONTENT ? DEMO_BOOKS : [];
  return { loaded: books !== null, list };
}

export default function Books() {
  const { isAdmin } = useContent();
  const { loaded, list } = useBooks();

  if (loaded && list.length === 0 && !isAdmin) return null;
  const [lead, ...rest] = list;

  return (
    <section id="books" className="mx-auto max-w-6xl scroll-mt-16 px-6 py-24 md:py-32">
      <Reveal>
        <SectionIntro eyebrow="Books" heading={<Editable k="books.heading" />} />
      </Reveal>

      {!loaded ? (
        <p className="mt-8 text-sm text-ink/60 dark:text-paper/60">Loading books…</p>
      ) : list.length === 0 ? (
        <div className="mt-8">
          <AdminHint title="No books published yet" href="/admin/books" action="Add your first book">
            Add a title, choose free or paid, upload the file, and it appears here.
          </AdminHint>
        </div>
      ) : (
        <>
          <div className="mt-8 md:mt-10 grid items-center gap-12 md:grid-cols-[minmax(0,340px)_1fr] md:gap-20">
            <Reveal from="left">
              <Tilt max={9}>
                <Cover book={lead} />
              </Tilt>
            </Reveal>
            <Reveal delay={100}>
              <PriceTag item={lead} />
              <h3 className="mt-4 font-display text-3xl font-bold leading-tight md:text-5xl">{lead.title}</h3>
              <p className="mt-2 text-ink/60 dark:text-paper/60">{lead.author}</p>
              {lead.description && (
                <p className="mt-6 line-clamp-6 max-w-prose whitespace-pre-line text-lg leading-relaxed text-ink/75 dark:text-paper/75">
                  {lead.description}
                </p>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                <GetButton item={asBuyable(lead)} />
                {rest.length > 0 && (
                  <Button href="/books" variant="outline">
                    All books
                  </Button>
                )}
              </div>
            </Reveal>
          </div>

          {rest.length > 0 && (
            <div className="mt-20 grid grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
              {rest.slice(0, 4).map((b, i) => (
                <Reveal key={b.id} delay={i * 80}>
                  <Tilt max={7}>
                    <Cover book={b} />
                  </Tilt>
                  <h3 className="mt-5 font-display font-semibold">{b.title}</h3>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <PriceTag item={b} />
                    <GetButton item={asBuyable(b)} label={b.is_free ? "Get" : "Buy"} variant="outline" className="!px-4 !py-1.5" />
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}
