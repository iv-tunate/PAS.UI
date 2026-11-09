"use client";

import { useState, type FormEvent, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api, ApiError } from "@/lib/api";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import AuthShell from "@/components/ui/AuthShell";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 10) {
      setError("Password needs to be at least 10 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/auth/reset-password", { token, new_password: password });
      setDone(true);
      setTimeout(() => router.push("/admin/login"), 2000);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "That reset link may have expired — request a new one."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (!token) {
    return (
      <p className="text-sm text-red-600 dark:text-red-400">
        This link is missing its reset token. Request a new one from{" "}
        <Link href="/admin/forgot-password" className="text-brand-violet dark:text-brand-sky hover:underline">
          the reset page
        </Link>
        .
      </p>
    );
  }

  if (done) {
    return (
      <p className="text-sm text-brand-violet dark:text-brand-sky">
        Password updated. Taking you to sign in…
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field
        label="New password"
        type="password"
        required
        minLength={10}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      <Button type="submit" variant="primary" disabled={submitting} className="w-full">
        {submitting ? "Saving…" : "Set new password"}
      </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight">Set a New Password</h1>
        <p className="mt-1 text-xs text-ink/60 dark:text-paper/60">Choose a secure password with at least 10 characters</p>
      </div>
      <Suspense fallback={<p className="text-sm text-ink/60 dark:text-paper/60">Loading…</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
