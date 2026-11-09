import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Courses from "@/components/Courses";
import Backdrop from "@/components/ui/Backdrop";
import Editable from "@/components/ui/Editable";

export const metadata = {
  title: "Relearn | Akintola Samuel",
  description: "Teachings and masterclasses by Akintola Samuel to watch, listen to, or download.",
};

export default function RelearnPage() {
  return (
    <>
      <Header />
      <main>
        <Backdrop variant="lattice">
          <section className="mx-auto max-w-6xl px-6 pb-12 pt-10 md:pb-16 md:pt-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-violet/30 bg-brand-violet/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-violet dark:text-brand-sky">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gradient" />
              Relearn
            </div>
            <Editable
              k="relearn.heading"
              as="h1"
              className="mt-4 block font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl"
            />
            <Editable
              k="relearn.body"
              as="p"
              className="mt-4 block max-w-2xl text-base leading-relaxed text-ink/70 dark:text-paper/70 sm:text-lg"
            />
          </section>
          <Courses />
        </Backdrop>
      </main>
      <Footer />
    </>
  );
}
