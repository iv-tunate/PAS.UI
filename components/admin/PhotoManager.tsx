"use client";

import { useState, type ChangeEvent } from "react";
import { ApiError } from "@/lib/api";
import { optimizedImage, uploadToCloudinary } from "@/lib/cloudinary";
import {
  ABOUT_PHOTO_COUNT,
  CHURCH_PHOTO_COUNT,
  HERO_PHOTO_FALLBACK,
  HERO_PHOTO_KEY,
  HERO_PHOTO_PLACEHOLDER,
  STAGE_PHOTO_COUNT,
  aboutPhotoFallback,
  aboutPhotoKey,
  aboutPhotoPlaceholder,
  churchPhotoFallback,
  churchPhotoKey,
  churchPhotoPlaceholder,
  stagePhotoFallback,
  stagePhotoKey,
  stagePhotoPlaceholder,
} from "@/lib/content-defaults";
import { useContent } from "@/contexts/ContentContext";
import Modal from "./Modal";

export type PhotoSet = "hero" | "about" | "pastor" | "church";

type SetConfig = {
  title: string;
  note: string;
  count: number;
  key: (n: number) => string;
  fallbackKey?: (n: number) => string;
  placeholder: (n: number) => string;
  fallback: (n: number) => string;
  folder: "pastor-photo" | "church-photo";
};

const SETS: Record<PhotoSet, SetConfig> = {
  hero: {
    title: "Hero image",
    note: "This image is displayed in the hero section. Landscape photos at least 1600px wide work best.",
    count: 1,
    key: () => HERO_PHOTO_KEY,
    fallbackKey: () => "hero.image",
    placeholder: () => HERO_PHOTO_PLACEHOLDER,
    fallback: () => HERO_PHOTO_FALLBACK,
    folder: "pastor-photo",
  },
  about: {
    title: "Photos for About section",
    note: "Up to 3 photos of Pastor Akin shown in the About section card. If you upload 1, only 1 displays. If more, it transitions between them.",
    count: ABOUT_PHOTO_COUNT,
    key: aboutPhotoKey,
    placeholder: aboutPhotoPlaceholder,
    fallback: aboutPhotoFallback,
    folder: "pastor-photo",
  },
  pastor: {
    title: "Full-screen photos (beneath About)",
    note: "Up to 4 photos for the full-screen section beneath About. If you upload 1, only 1 displays. If more, it transitions between them.",
    count: STAGE_PHOTO_COUNT,
    key: stagePhotoKey,
    placeholder: stagePhotoPlaceholder,
    fallback: stagePhotoFallback,
    folder: "pastor-photo",
  },
  church: {
    title: "Photos of the church",
    note: "These four photos play beside the \"This is home\" text. Landscape photos work best.",
    count: CHURCH_PHOTO_COUNT,
    key: churchPhotoKey,
    placeholder: churchPhotoPlaceholder,
    fallback: churchPhotoFallback,
    folder: "church-photo",
  },
};

/**
 * A set of photos an admin can swap. Replace uploads to Cloudinary and
 * saves the link; Reset deletes it so the placeholder returns. A slot is never left blank.
 */
export default function PhotoManager({ set, onClose }: { set: PhotoSet; onClose: () => void }) {
  const cfg = SETS[set];
  const { get, isCustom, save, reset } = useContent();
  const [busy, setBusy] = useState<number | null>(null);
  const [percent, setPercent] = useState(0);
  const [error, setError] = useState("");

  async function replace(n: number, e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setBusy(n);
    setPercent(0);
    setError("");
    try {
      const url = await uploadToCloudinary(file, cfg.folder, setPercent);
      try {
        await save(cfg.key(n), url);
      } catch (saveErr) {
        if (saveErr instanceof ApiError && (saveErr.code === "unknown_key" || saveErr.message.includes("can't be edited"))) {
          throw new Error("The backend server needs to be restarted to support the new image key. Please restart PAS.server and try again.");
        }
        throw saveErr;
      }
      if (cfg.fallbackKey && isCustom(cfg.fallbackKey(n))) {
        await reset(cfg.fallbackKey(n));
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Your admin session has expired or you are not signed in. Please log in at /admin/login to upload images.");
      } else {
        setError(err instanceof Error ? err.message : "Upload failed. Try a different image.");
      }
    } finally {
      setBusy(null);
    }
  }

  async function clear(n: number) {
    setBusy(n);
    setError("");
    try {
      try {
        await reset(cfg.key(n));
      } catch (err) {
        if (err instanceof ApiError && (err.code === "unknown_key" || err.message.includes("can't be edited"))) {
          // Key not recognized by backend yet, safe to ignore
        } else {
          throw err;
        }
      }
      if (cfg.fallbackKey && isCustom(cfg.fallbackKey(n))) {
        await reset(cfg.fallbackKey(n));
      }
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setError("Your admin session has expired or you are not signed in. Please log in at /admin/login.");
      } else {
        setError(err instanceof ApiError ? err.message : "Could not reset this photo.");
      }
    } finally {
      setBusy(null);
    }
  }

  return (
    <Modal title={cfg.title} onClose={onClose} wide={cfg.count > 1}>
      <p className="mb-5 text-sm text-ink/60 dark:text-paper/60">{cfg.note}</p>

      <div className={cfg.count === 1 ? "mx-auto max-w-sm" : cfg.count === 4 ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-4" : "grid gap-4 sm:grid-cols-2 md:grid-cols-3"}>
        {Array.from({ length: cfg.count }, (_, i) => i + 1).map((n) => {
          const custom = isCustom(cfg.key(n)) || (cfg.fallbackKey ? isCustom(cfg.fallbackKey(n)) : false);
          const currentUrl = get(cfg.key(n)) || (cfg.fallbackKey ? get(cfg.fallbackKey(n)) : "");
          return (
            <div key={n} className="border border-ink/10 dark:border-paper/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={custom && currentUrl ? optimizedImage(currentUrl, 600) : cfg.placeholder(n)}
                alt={`Photo ${n}`}
                onError={(e) => {
                  if (e.currentTarget.dataset.fb !== "1") {
                    e.currentTarget.dataset.fb = "1";
                    e.currentTarget.src = cfg.fallback(n);
                  }
                }}
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="flex items-center justify-between gap-2 p-3 text-sm">
                <span className="text-ink/60 dark:text-paper/60">
                  {cfg.count === 1
                    ? busy === n && percent > 0 && percent < 100
                      ? `${percent}%`
                      : custom
                      ? "Your photo"
                      : "Placeholder"
                    : `${n}. ${busy === n && percent > 0 && percent < 100 ? `${percent}%` : custom ? "Your photo" : "Empty slot"}`}
                </span>
                <span className="flex items-center gap-3">
                  <label className="cursor-pointer font-medium text-brand-violet hover:underline dark:text-brand-sky">
                    {busy === n ? "Working…" : "Replace"}
                    <input type="file" accept="image/*" className="sr-only" disabled={busy !== null} onChange={(e) => replace(n, e)} />
                  </label>
                  {custom && (
                    <button
                      onClick={() => clear(n)}
                      disabled={busy !== null}
                      className="text-ink/60 hover:text-ink disabled:opacity-50 dark:text-paper/60 dark:hover:text-paper"
                    >
                      Reset
                    </button>
                  )}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </Modal>
  );
}
