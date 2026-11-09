"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth, ApiError } from "@/contexts/AuthContext";
import Field from "@/components/ui/Field";
import Button from "@/components/ui/Button";
import AuthShell from "@/components/ui/AuthShell";

export default function AdminLoginPage() {
  const { user, loading, login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) router.replace("/admin");
  }, [user, loading, router]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(email, password);
      router.replace("/admin");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not sign in. Please try again.");
      setBusy(false);
    }
  }

  return (
    <AuthShell>
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight">Admin Sign In</h1>
        <p className="mt-1 text-xs text-ink/60 dark:text-paper/60">Enter your credentials to access your dashboard</p>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email" type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Field
          label="Password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          trailingLabel={
            <Link href="/admin/forgot-password" className="text-xs text-brand-violet hover:underline dark:text-brand-sky">
              Forgot password?
            </Link>
          }
        />
        {error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}
        <Button type="submit" variant="primary" disabled={busy} className="w-full">
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}
