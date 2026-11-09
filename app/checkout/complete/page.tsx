"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";

type Status = { status: "pending" | "success" | "failed"; title: string; free: boolean; delivered: boolean };

/** Where buyers land after the payment page. Polls until the payment is confirmed. */
function Body() {
  const ref = useSearchParams().get("ref") || "";
  const [st, setSt] = useState<Status | null>(null);
  const [gaveUp, setGaveUp] = useState(false);
  const tries = useRef(0);

  useEffect(() => {
    if (!ref) return;
    let stop = false;
    let timer: ReturnType<typeof setTimeout>;
    async function check() {
      try {
        const s = await api.get<Status>(`/orders/${encodeURIComponent(ref)}/status`);
        if (stop) return;
        setSt(s);
        if (s.status !== "pending") return;
      } catch {
        // keep trying; a blip should not look like a failure
      }
      tries.current += 1;
      if (tries.current >= 20) {
        if (!stop) setGaveUp(true);
        return;
      }
      timer = setTimeout(check, 3000);
    }
    check();
    return () => {
      stop = true;
      clearTimeout(timer);
    };
  }, [ref]);

  if (!ref) return <Message title="Nothing to show here" text="This page is where you land after paying." />;
  if (st?.status === "success")
    return (
      <Message
        title="Payment received. Thank you!"
        text={`The link for ${st.title} is on its way to your inbox. It usually arrives within a minute. Check spam or promotions if you cannot see it.`}
      />
    );
  if (st?.status === "failed")
    return <Message title="The payment did not go through" text="You have not been charged for this order. You are welcome to try again from the site." />;
  if (gaveUp)
    return (
      <Message
        title="Still confirming your payment"
        text="This is taking longer than usual. If you were charged, the link will be emailed to you automatically as soon as the bank confirms. You do not need to pay again."
      />
    );
  return <Message title="Confirming your payment…" text="Please keep this page open for a moment." busy />;
}

function Message({ title, text, busy }: { title: string; text: string; busy?: boolean }) {
  return (
    <div className="mx-auto max-w-xl px-6 py-28 text-center" role="status" aria-live="polite">
      {busy && <div className="mx-auto mb-8 h-10 w-10 animate-spin rounded-full border-2 border-ink/20 border-t-brand-violet dark:border-paper/20 dark:border-t-brand-sky" />}
      <h1 className="font-display text-3xl font-semibold md:text-4xl">{title}</h1>
      <p className="mt-5 leading-relaxed text-ink/70 dark:text-paper/70">{text}</p>
      {!busy && (
        <div className="mt-8">
          <Button href="/">Back to the home page</Button>
        </div>
      )}
    </div>
  );
}

export default function CheckoutCompletePage() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={null}>
          <Body />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
