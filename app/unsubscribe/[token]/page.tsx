"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Button from "@/components/ui/Button";
import { api, ApiError } from "@/lib/api";

/** The unsubscribe link in every newsletter. It asks first, so email scanners cannot do it by accident. */
export default function UnsubscribePage() {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<"ask" | "busy" | "done">("ask");
  const [error, setError] = useState("");

  async function confirm() {
    setState("busy");
    setError("");
    try {
      await api.post("/newsletter/unsubscribe", { token });
      setState("done");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
      setState("ask");
    }
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-xl px-6 py-28 text-center">
        {state === "done" ? (
          <>
            <h1 className="font-display text-3xl font-semibold">You have been unsubscribed</h1>
            <p className="mt-5 text-ink/70 dark:text-paper/70">You will not get any more newsletters from us.</p>
          </>
        ) : (
          <>
            <h1 className="font-display text-3xl font-semibold">Unsubscribe from our newsletter?</h1>
            <p className="mt-5 text-ink/70 dark:text-paper/70">You will stop getting emails about new messages, books and events.</p>
            {error && <p role="alert" className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
            <div className="mt-8 flex justify-center gap-3">
              <Button onClick={confirm} disabled={state === "busy"}>{state === "busy" ? "One moment…" : "Yes, unsubscribe me"}</Button>
              <Button href="/" variant="outline">Stay subscribed</Button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
