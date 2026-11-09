import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Honest placeholder — not fabricated legal text. Swap this body for
// real terms (refunds on courses/books, account conduct, content
// licensing) reviewed before launch.
export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-24">
        <h1 className="font-display font-semibold text-3xl md:text-4xl mb-6">Terms of service</h1>
        <p className="text-ink/70 dark:text-paper/70 leading-relaxed mb-4">
          This page is a placeholder. The real terms — covering course and
          book purchases, refunds, and account use — will go here before the
          site goes live.
        </p>
        <p className="text-ink/70 dark:text-paper/70 leading-relaxed">
          Questions in the meantime? Reach out from the{" "}
          <a href="/#about" className="text-brand-violet dark:text-brand-sky hover:underline">
            About
          </a>{" "}
          section.
        </p>
      </main>
      <Footer />
    </>
  );
}
