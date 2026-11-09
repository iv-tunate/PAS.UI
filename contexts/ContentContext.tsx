"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { CONTENT_DEFAULTS } from "@/lib/content-defaults";
import { useAuth } from "@/contexts/AuthContext";
import ContentEditor from "@/components/admin/ContentEditor";
import PhotoManager, { type PhotoSet } from "@/components/admin/PhotoManager";

type ContentValue = {
  /** Saved text for a key, or its placeholder. */
  get: (key: string) => string;
  /** True when the database holds a value for this key. */
  isCustom: (key: string) => boolean;
  /** False until the first load finishes (successfully or not). */
  ready: boolean;
  isAdmin: boolean;
  save: (key: string, value: string) => Promise<void>;
  /** Deletes the saved value so the placeholder returns. */
  reset: (key: string) => Promise<void>;
  openEditor: (key: string) => void;
  openPhotos: (set?: PhotoSet) => void;
};

const ContentContext = createContext<ContentValue | null>(null);

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [saved, setSaved] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [photosOpen, setPhotosOpen] = useState<PhotoSet | null>(null);

  useEffect(() => {
    api
      .get<Record<string, string>>("/content")
      .then((data) => setSaved(data || {}))
      .catch(() => {}) // offline or API down: placeholders still render
      .finally(() => setReady(true));
  }, []);

  const get = useCallback((key: string) => saved[key] || CONTENT_DEFAULTS[key]?.text || "", [saved]);
  const isCustom = useCallback((key: string) => Boolean(saved[key]), [saved]);

  const save = useCallback(async (key: string, value: string) => {
    const clean = value.trim();
    await api.put("/admin/content", { key, value: clean }, true);
    setSaved((prev) => {
      const next = { ...prev };
      if (clean) next[key] = clean;
      else delete next[key];
      return next;
    });
  }, []);

  const reset = useCallback((key: string) => save(key, ""), [save]);

  const value = useMemo<ContentValue>(
    () => ({
      get,
      isCustom,
      ready,
      isAdmin,
      save,
      reset,
      openEditor: setEditing,
      openPhotos: (set: PhotoSet = "pastor") => setPhotosOpen(set),
    }),
    [get, isCustom, ready, isAdmin, save, reset]
  );

  return (
    <ContentContext.Provider value={value}>
      {children}
      {isAdmin && editing && <ContentEditor contentKey={editing} onClose={() => setEditing(null)} />}
      {isAdmin && photosOpen && <PhotoManager set={photosOpen} onClose={() => setPhotosOpen(null)} />}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used inside <ContentProvider>");
  return ctx;
}
