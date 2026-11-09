import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Honest placeholder — not fabricated legal text. Swap this body for
// a real privacy policy reviewed by Akintola Samuel (and a lawyer, if
// payments/personal data mean one should look at it) before launch.
export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-6 py-24">
        <h1 className="font-display font-semibold text-3xl md:text-4xl mb-6">Privacy policy</h1>
        <p className="text-ink/70 dark:text-paper/70 leading-relaxed mb-4">
          This page is a placeholder. The real policy — covering what account,
          payment, and newsletter data we collect, how it's used, and how to
          request its deletion — will go here before the site goes live.
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
