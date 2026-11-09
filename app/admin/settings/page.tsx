"use client";

import { useEffect, useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import { parseYouTubeId, ytThumb } from "@/lib/youtube";
import { PageHead, Label, inputClass, Btn, FileUpload, Notice, errText } from "@/components/admin/kit";

type Settings = Record<string, string>;

export default function SettingsPage() {
  const [s, setS] = useState<Settings | null>(null);
  const [ytChannel, setYtChannel] = useState("");
  const [videoMode, setVideoMode] = useState<"link" | "upload">("link");
  const [note, setNote] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.get<Settings>("/settings").then(setS).catch((e) => setNote({ kind: "error", text: errText(e) }));
    api
      .get<Record<string, string>>("/content")
      .then((c) => {
        if (c?.["social.youtube"]) setYtChannel(c["social.youtube"]);
      })
      .catch(() => {});
  }, []);

  const set = (k: string, v: string) => setS((p) => ({ ...(p ?? {}), [k]: v }));

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!s) return;
    setBusy(true);
    setNote(null);
    try {
      // The API replaces every field, so preserve existing values for fields not on this screen
      const KEYS = [
        "pastor_name",
        "pastor_bio",
        "pastor_photo_url",
        "campuses_count",
        "years_leadership",
        "continents_reached",
        "books_url",
        "website_url",
        "contact_email",
        "hero_video_url",
      ];
      const body: Settings = {};
      for (const k of KEYS) body[k] = typeof s[k] === "string" ? s[k] : "";
      const saved = await api.put<Settings>("/admin/settings", body, true);
      setS(saved ?? s);

      // Save YouTube channel link if updated
      if (ytChannel.trim()) {
        await api.put("/admin/content", { key: "social.youtube", value: ytChannel.trim() }, true).catch(() => {});
      }

      setNote({ kind: "ok", text: "Settings saved successfully." });
    } catch (err) {
      setNote({ kind: "error", text: errText(err) });
    }
    setBusy(false);
  }

  if (!s) return <>{note ? <Notice kind="error">{note.text}</Notice> : <p className="text-sm">Loading…</p>}</>;

  const videoUrl = s.hero_video_url || "";
  const ytVideoId = parseYouTubeId(videoUrl);

  return (
    <>
      <PageHead
        title="Site settings"
        hint="Manage key site configurations, welcome video, and primary channels."
      />
      <form onSubmit={save} className="max-w-2xl space-y-8">
        {/* Welcome Video Section */}
        <div className="rounded-2xl border border-ink/10 dark:border-paper/10 bg-paper/50 dark:bg-ink/50 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">Welcome Video</h2>
              <p className="text-xs text-ink/60 dark:text-paper/60">
                Plays immediately below the hero on the landing page. Leave empty to completely hide the section.
              </p>
            </div>
            {videoUrl && (
              <button
                type="button"
                onClick={() => set("hero_video_url", "")}
                className="text-xs font-medium text-red-600 hover:underline dark:text-red-400"
              >
                Remove video (Hide)
              </button>
            )}
          </div>

          {/* Toggle Link vs Upload */}
          <div className="flex gap-2 text-xs font-medium">
            <button
              type="button"
              onClick={() => setVideoMode("link")}
              className={`rounded-full px-4 py-1.5 transition-colors ${
                videoMode === "link"
                  ? "bg-ink text-paper dark:bg-paper dark:text-ink"
                  : "border border-ink/20 dark:border-paper/20 hover:border-ink/50"
              }`}
            >
              Paste YouTube or Video link
            </button>
            <button
              type="button"
              onClick={() => setVideoMode("upload")}
              className={`rounded-full px-4 py-1.5 transition-colors ${
                videoMode === "upload"
                  ? "bg-ink text-paper dark:bg-paper dark:text-ink"
                  : "border border-ink/20 dark:border-paper/20 hover:border-ink/50"
              }`}
            >
              Upload video file
            </button>
          </div>

          {videoMode === "link" ? (
            <Label
              text="Video Link"
              hint="YouTube link (e.g. https://www.youtube.com/watch?v=... or https://youtu.be/...) or direct MP4 URL"
            >
              <input
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => set("hero_video_url", e.target.value)}
                className={inputClass}
              />
            </Label>
          ) : (
            <FileUpload
              label="Upload MP4 Video file"
              folder="hero-video"
              accept="video/*"
              value={videoUrl}
              onChange={(u) => set("hero_video_url", u)}
              hint="Uploads to cloud storage. For large files, pasting a YouTube link is recommended."
            />
          )}

          {/* Video preview badge */}
          {videoUrl && (
            <div className="flex items-center gap-3 pt-2 text-xs text-emerald-600 dark:text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>
                {ytVideoId ? "YouTube video connected" : "Video URL linked"}:{" "}
                <span className="font-mono truncate max-w-xs inline-block align-bottom">{videoUrl}</span>
              </span>
            </div>
          )}
        </div>

        {/* Channels & Contact */}
        <div className="rounded-2xl border border-ink/10 dark:border-paper/10 bg-paper/50 dark:bg-ink/50 p-6 space-y-5">
          <h2 className="font-display text-lg font-semibold">Channels & Contact</h2>

          <Label
            text="YouTube Profile or Channel URL"
            hint="Visitors can subscribe and view all published messages directly"
          >
            <input
              type="url"
              placeholder="https://www.youtube.com/@akintolasamuel"
              value={ytChannel}
              onChange={(e) => setYtChannel(e.target.value)}
              className={inputClass}
            />
          </Label>

          <Label text="Contact email" hint="Shown to visitors where needed">
            <input
              type="email"
              maxLength={200}
              placeholder="contact@akintolasamuel.org"
              value={s.contact_email ?? ""}
              onChange={(e) => set("contact_email", e.target.value)}
              className={inputClass}
            />
          </Label>
        </div>

        {note && <Notice kind={note.kind}>{note.text}</Notice>}
        <Btn type="submit" disabled={busy}>
          {busy ? "Saving…" : "Save settings"}
        </Btn>
      </form>
    </>
  );
}
