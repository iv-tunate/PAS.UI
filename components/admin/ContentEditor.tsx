"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api";
import { CONTENT_DEFAULTS } from "@/lib/content-defaults";
import { useContent } from "@/contexts/ContentContext";
import Button from "@/components/ui/Button";
import Modal from "./Modal";

/** Edit one piece of text. Reset puts the placeholder back. */
export default function ContentEditor({ contentKey, onClose }: { contentKey: string; onClose: () => void }) {
  const { get, isCustom, save, reset } = useContent();
  const meta = CONTENT_DEFAULTS[contentKey];
  const [value, setValue] = useState(get(contentKey));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await action();
      onClose();
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Could not save. Please try again.");
      setBusy(false);
    }
  }

  const fieldClass =
    "w-full border border-ink/20 bg-transparent px-3 py-2.5 text-base outline-none focus:border-brand-violet dark:border-paper/20 dark:focus:border-brand-sky";

  return (
    <Modal title={meta?.label ?? contentKey} onClose={onClose}>
      {meta?.multiline ? (
        <textarea
          autoFocus
          rows={contentKey === "about.bio" ? 12 : 5}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={`${fieldClass} leading-relaxed`}
        />
      ) : (
        <input autoFocus value={value} onChange={(e) => setValue(e.target.value)} className={fieldClass} />
      )}

      {isCustom(contentKey) ? (
        <p className="mt-3 text-sm text-ink/60 dark:text-paper/60">
          Placeholder: <span className="italic">{meta?.text}</span>
        </p>
      ) : (
        <p className="mt-3 text-sm text-ink/60 dark:text-paper/60">
          This is placeholder text. Saving replaces it for every visitor.
        </p>
      )}

      {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Button onClick={() => run(() => save(contentKey, value))} disabled={busy}>
          {busy ? "Saving…" : "Save"}
        </Button>
        <Button variant="ghost" onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        {isCustom(contentKey) && (
          <Button variant="ghost" onClick={() => run(() => reset(contentKey))} disabled={busy} className="ml-auto">
            Reset to placeholder
          </Button>
        )}
      </div>
    </Modal>
  );
}
