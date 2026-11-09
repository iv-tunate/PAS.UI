"use client";

import { useState, type FormEvent } from "react";
import { api, ApiError } from "@/lib/api";
import Button from "./ui/Button";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    try {
      await api.post("/newsletter/subscribe", { email: email.trim() });
      setStatus("done");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setError(err instanceof ApiError ? err.message : "Could not subscribe. Please try again.");
    }
  }

  if (status === "done") {
    return <p className="text-sm text-brand-sky">You are on the list. Thank you.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-2">
      <div className="flex gap-2">
        <input
          type="email"
          required
          aria-label="Email address"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-w-0 flex-1 border border-ink/15 bg-transparent px-3 py-2 text-sm outline-none focus:border-brand-violet dark:border-paper/15"
        />
        <Button type="submit" variant="primary" disabled={status === "loading"} className="shrink-0">
          {status === "loading" ? "…" : "Join"}
        </Button>
      </div>
      {status === "error" && <p className="text-xs text-red-500">{error}</p>}
    </form>
  );
}
