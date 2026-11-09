"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import AuthShell from "@/components/ui/AuthShell";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post("/auth/forgot-password", { email });
    } finally {
      setSent(true);
      setSubmitting(false);
    }
  }

  return (
    <AuthShell>
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight">Reset Password</h1>
        <p className="mt-1 text-xs text-ink/60 dark:text-paper/60">
          Enter your email and we&apos;ll send you a link to reset it
        </p>
      </div>

      {sent ? (
        <p className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-center text-sm text-emerald-700 dark:text-emerald-400">
          If that email is registered, a reset link is on its way. Check your inbox.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" variant="primary" disabled={submitting} className="w-full">
            {submitting ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-ink/60 dark:text-paper/60">
        <Link href="/admin/login" className="text-brand-violet dark:text-brand-sky hover:underline">
          Back to sign in
        </Link>
      </p>
    </AuthShell>
  );
}
