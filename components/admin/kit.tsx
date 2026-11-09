"use client";

import { useEffect, useState, type ReactNode } from "react";
import { ApiError } from "@/lib/api";
import { uploadToCloudinary, type UploadFolder } from "@/lib/cloudinary";

/** Small building blocks shared by every admin page, so they all look and behave the same. */

export const inputClass =
  "w-full border border-ink/20 bg-transparent px-3 py-2.5 text-base outline-none focus:border-brand-violet dark:border-paper/20 dark:focus:border-brand-sky";

export function errText(err: unknown, fallback = "Something went wrong. Please try again.") {
  return err instanceof ApiError || err instanceof Error ? err.message : fallback;
}

export function PageHead({ title, hint, action }: { title: string; hint?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-semibold md:text-3xl">{title}</h1>
        {hint && <p className="mt-1 max-w-xl text-sm text-ink/60 dark:text-paper/60">{hint}</p>}
      </div>
      {action}
    </div>
  );
}

export function Btn({
  children,
  onClick,
  type = "button",
  kind = "primary",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  kind?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  className?: string;
}) {
  const styles = {
    primary: "bg-ink text-paper dark:bg-paper dark:text-ink hover:opacity-90",
    ghost: "border border-ink/20 dark:border-paper/20 hover:border-ink/50 dark:hover:border-paper/50",
    danger: "border border-red-500/50 text-red-600 hover:bg-red-500/10 dark:text-red-400",
  }[kind];
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50 ${styles} ${className}`}
    >
      {children}
    </button>
  );
}

/** Two-step delete: the first click asks, the second does it. No accidental deletions. */
export function DeleteBtn({ onConfirm, label = "Delete" }: { onConfirm: () => void | Promise<void>; label?: string }) {
  const [armed, setArmed] = useState(false);
  useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 4000);
    return () => clearTimeout(t);
  }, [armed]);
  return (
    <Btn kind="danger" className="!px-3 !py-1" onClick={() => (armed ? onConfirm() : setArmed(true))}>
      {armed ? "Sure? Click again" : label}
    </Btn>
  );
}

export function Label({ text, hint, children }: { text: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="font-medium">{text}</span>
      {hint && <span className="ml-2 text-ink/50 dark:text-paper/50">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string }) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-brand-violet" : "bg-ink/25 dark:bg-paper/25"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
      </button>
      <span>
        <span className="font-medium">{label}</span>
        {hint && <span className="block text-ink/55 dark:text-paper/55">{hint}</span>}
      </span>
    </label>
  );
}

/** Free or paid, as two clear buttons. Choosing Free hides the price boxes entirely. */
export function FreePaid({ free, onChange }: { free: boolean; onChange: (free: boolean) => void }) {
  return (
    <div role="radiogroup" aria-label="Free or paid" className="inline-flex overflow-hidden rounded-full border border-ink/20 dark:border-paper/20">
      {[true, false].map((v) => (
        <button
          key={String(v)}
          type="button"
          role="radio"
          aria-checked={free === v}
          onClick={() => onChange(v)}
          className={`px-5 py-2 text-sm font-medium transition-colors ${free === v ? "bg-ink text-paper dark:bg-paper dark:text-ink" : ""}`}
        >
          {v ? "Free" : "Paid"}
        </button>
      ))}
    </div>
  );
}

/** Whole naira / dollars in the box, kobo / cents on the wire. */
export function MoneyInputs({
  kobo,
  cents,
  onKobo,
  onCents,
}: {
  kobo: number;
  cents: number;
  onKobo: (v: number) => void;
  onCents: (v: number) => void;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Label text="Price in naira (₦)" hint="Paystack / Flutterwave">
        <input type="number" min={0} step="1" value={kobo ? kobo / 100 : ""} onChange={(e) => onKobo(Math.round(Number(e.target.value || 0) * 100))} className={inputClass} />
      </Label>
      <Label text="Price in dollars ($)" hint="Stripe, optional">
        <input type="number" min={0} step="0.01" value={cents ? cents / 100 : ""} onChange={(e) => onCents(Math.round(Number(e.target.value || 0) * 100))} className={inputClass} />
      </Label>
    </div>
  );
}

/**
 * Picks a file, uploads it to Cloudinary with a progress bar, and hands the
 * resulting link back. Shows a preview for pictures.
 */
export function FileUpload({
  label,
  folder,
  value,
  onChange,
  accept,
  hint,
  image = false,
}: {
  label: string;
  folder: UploadFolder;
  value: string;
  onChange: (url: string) => void;
  accept: string;
  hint?: string;
  image?: boolean;
}) {
  const [pct, setPct] = useState<number | null>(null);
  const [error, setError] = useState("");

  async function pick(file?: File) {
    if (!file) return;
    setError("");
    setPct(0);
    try {
      onChange(await uploadToCloudinary(file, folder, setPct));
    } catch (err) {
      setError(errText(err, "Upload failed."));
    }
    setPct(null);
  }

  return (
    <div className="text-sm">
      <p className="font-medium">{label}</p>
      {hint && <p className="mt-0.5 text-ink/55 dark:text-paper/55">{hint}</p>}
      <div className="mt-2 flex flex-wrap items-center gap-4">
        {image && value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="h-20 w-20 border border-ink/10 object-cover dark:border-paper/10" />
        )}
        <div>
          <label className="inline-flex cursor-pointer items-center rounded-full border border-ink/20 px-4 py-1.5 font-medium hover:border-ink/50 dark:border-paper/20 dark:hover:border-paper/50">
            {pct !== null ? `Uploading ${pct}%` : value ? "Replace file" : "Choose file"}
            <input type="file" accept={accept} className="sr-only" disabled={pct !== null} onChange={(e) => { pick(e.target.files?.[0]); e.target.value = ""; }} />
          </label>
          {value && !image && <p className="mt-2 max-w-xs truncate text-xs text-emerald-600 dark:text-emerald-400">Uploaded: {value.split("/").pop()}</p>}
          {value && pct === null && (
            <button type="button" onClick={() => onChange("")} className="ml-3 text-ink/55 underline dark:text-paper/55">
              Remove
            </button>
          )}
        </div>
      </div>
      {pct !== null && (
        <div className="mt-3 h-1.5 w-full max-w-xs bg-ink/10 dark:bg-paper/15">
          <div className="h-full bg-brand-gradient transition-all" style={{ width: `${pct}%` }} />
        </div>
      )}
      {error && <p role="alert" className="mt-2 text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

export function Notice({ kind, children }: { kind: "ok" | "warn" | "error"; children: ReactNode }) {
  const c = {
    ok: "border-emerald-500/40 bg-emerald-500/10",
    warn: "border-amber-500/50 bg-amber-500/10",
    error: "border-red-500/50 bg-red-500/10",
  }[kind];
  return (
    <p role={kind === "error" ? "alert" : "status"} className={`border px-4 py-3 text-sm ${c}`}>
      {children}
    </p>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <p className="border border-dashed border-ink/20 p-8 text-center text-sm text-ink/60 dark:border-paper/20 dark:text-paper/60">{children}</p>;
}

export function Badge({ children, tone = "plain" }: { children: ReactNode; tone?: "plain" | "good" | "warn" | "bad" }) {
  const c = {
    plain: "border-ink/20 dark:border-paper/25",
    good: "border-emerald-500/50 text-emerald-700 dark:text-emerald-400",
    warn: "border-amber-500/60 text-amber-700 dark:text-amber-400",
    bad: "border-red-500/50 text-red-600 dark:text-red-400",
  }[tone];
  return <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-medium ${c}`}>{children}</span>;
}

/** Loads a list once and exposes reload. Keeps each page short. */
export function useLoad<T>(load: () => Promise<T>, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);
  useEffect(() => {
    let live = true;
    load()
      .then((d) => live && (setData(d), setError("")))
      .catch((e) => live && setError(errText(e, "Could not load this page.")));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick, ...deps]);
  return { data, error, reload: () => setTick((t) => t + 1) };
}
