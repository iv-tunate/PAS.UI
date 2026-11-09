"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Backdrop from "@/components/ui/Backdrop";
import Reveal from "@/components/ui/Reveal";
import Editable from "@/components/ui/Editable";
import Tilt from "@/components/ui/Tilt";
import SampleBadge from "@/components/ui/SampleBadge";
import AdminHint from "@/components/ui/AdminHint";
import GetButton from "@/components/GetButton";
import { PriceTag, useBooks } from "@/components/Books";
import { DEMO_BOOK_COVER, isDemoId } from "@/lib/demo-content";

export default function BooksPage() {
  const { loaded, list } = useBooks();

  return (
    <>
      <Header />
      <main>
        <Backdrop variant="lattice">
          <section className="mx-auto max-w-6xl px-6 pb-24 pt-10 md:pt-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-violet/30 bg-brand-violet/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-violet dark:text-brand-sky">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gradient" />
              Books
            </div>
            <Editable
              k="books.heading"
              as="h1"
              className="mt-4 block font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl"
            />
            <Editable
              k="books.body"
              as="p"
              className="mt-4 block max-w-2xl text-base leading-relaxed text-ink/70 dark:text-paper/70 sm:text-lg"
            />

            {!loaded ? (
              <p className="mt-12 text-sm text-ink/60 dark:text-paper/60">Loading books…</p>
            ) : list.length === 0 ? (
              <div className="mt-12">
                <p className="text-ink/65 dark:text-paper/65">New books are coming soon.</p>
                <div className="mt-6">
                  <AdminHint title="No books published yet" href="/admin/books" action="Add a book">
                    Books you publish appear here.
                  </AdminHint>
                </div>
              </div>
            ) : (
              <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-14 sm:grid-cols-3 lg:grid-cols-4">
                {list.map((b, i) => (
                  <Reveal key={b.id} delay={(i % 4) * 70}>
                    <Tilt max={7}>
                      <div className="book-cover relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={b.cover_image_url || DEMO_BOOK_COVER}
                          alt={`Cover of ${b.title}`}
                          loading="lazy"
                          className="aspect-[3/4] w-full object-cover"
                        />
                        {isDemoId(b.id) && <SampleBadge className="absolute left-3 top-3 z-10" />}
                      </div>
                    </Tilt>
                    <h2 className="mt-5 font-display font-semibold">{b.title}</h2>
                    <p className="mt-1 line-clamp-3 text-sm text-ink/60 dark:text-paper/60">{b.description}</p>
                    <div className="mt-3 flex items-center justify-between gap-2">
                      <PriceTag item={b} />
                      <GetButton
                        item={{ kind: "book", id: b.id, title: b.title, is_free: b.is_free, price_kobo: b.price_kobo, price_usd_cents: b.price_usd_cents }}
                        label={b.is_free ? "Get" : "Buy"}
                        variant="outline"
                        className="!px-4 !py-1.5"
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
            )}
          </section>
        </Backdrop>
      </main>
      <Footer />
    </>
  );
}
