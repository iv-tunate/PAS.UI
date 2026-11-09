import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Backdrop from "@/components/ui/Backdrop";
import Editable from "@/components/ui/Editable";
import MessageGrid from "@/components/MessageGrid";

export const metadata = {
  title: "Messages | Akintola Samuel",
  description: "Teaching from Akintola Samuel. Watch right here.",
};

export default function MessagesPage() {
  return (
    <>
      <Header />
      <main>
        <Backdrop variant="aurora-b">
          <section className="mx-auto max-w-6xl px-6 pb-8 pt-6 md:pb-10 md:pt-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-violet/30 bg-brand-violet/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-brand-violet dark:text-brand-sky">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-gradient" />
              Messages
            </div>
            <Editable
              k="messages.heading"
              as="h1"
              className="mt-4 block font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl"
            />
            <Editable
              k="messages.body"
              as="p"
              className="mt-4 block max-w-2xl text-base leading-relaxed text-ink/70 dark:text-paper/70 sm:text-lg"
            />
          </section>
          <div className="mx-auto max-w-6xl px-6 pb-24">
            <MessageGrid />
          </div>
        </Backdrop>
      </main>
      <Footer />
    </>
  );
}
