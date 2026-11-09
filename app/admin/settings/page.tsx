"use client";

import { useEffect, useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import { parseYouTubeId } from "@/lib/youtube";
import { PageHead, Label, inputClass, Btn, FileUpload, Notice, errText } from "@/components/admin/kit";

type Settings = Record<string, string>;

function normalizeVideoUrl(val: string): string {
  let v = val.trim();
  if (!v) return "";
  if (v.startsWith("http://")) {
    v = "https://" + v.slice(7);
  } else if (!v.startsWith("https://")) {
    v = "https://" + v;
  }
  return v;
}

export default function SettingsPage() {
  const [s, setS] = useState<Settings | null>(null);
  const [initialVideoUrl, setInitialVideoUrl] = useState("");
  const [ytChannel, setYtChannel] = useState("");
  const [videoMode, setVideoMode] = useState<"link" | "upload">("link");
  const [note, setNote] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [videoNote, setVideoNote] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api
      .get<Settings>("/settings")
      .then((data) => {
        setS(data);
        setInitialVideoUrl(data?.hero_video_url || "");
      })
      .catch((e) => setNote({ kind: "error", text: errText(e) }));

    api
      .get<Record<string, string>>("/content")
      .then((c) => {
        if (c?.["social.youtube"]) setYtChannel(c["social.youtube"]);
      })
      .catch(() => {});
  }, []);

  const set = (k: string, v: string) => setS((p) => ({ ...(p ?? {}), [k]: v }));

  async function saveAll(e?: FormEvent) {
    if (e) e.preventDefault();
    if (!s) return;
    setBusy(true);
    setNote(null);
    setVideoNote(null);

    try {
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
      for (const k of KEYS) {
        body[k] = typeof s[k] === "string" ? s[k].trim() : "";
      }

      if (body.hero_video_url) {
        body.hero_video_url = normalizeVideoUrl(body.hero_video_url);
      }

      const saved = await api.put<Settings>("/admin/settings", body, true);
      const updated = saved ?? { ...s, hero_video_url: body.hero_video_url };
      setS(updated);
      setInitialVideoUrl(updated.hero_video_url || "");

      // Save YouTube channel link if updated
      if (ytChannel.trim()) {
        await api.put("/admin/content", { key: "social.youtube", value: ytChannel.trim() }, true).catch(() => {});
      }

      setNote({ kind: "ok", text: "Settings saved successfully." });
      setVideoNote({ kind: "ok", text: "Video saved and live on landing page." });
    } catch (err) {
      const msg = errText(err);
      setNote({ kind: "error", text: msg });
      setVideoNote({ kind: "error", text: msg });
    } finally {
      setBusy(false);
    }
  }

  if (!s) return <>{note ? <Notice kind="error">{note.text}</Notice> : <p className="text-sm">Loading…</p>}</>;

  const videoUrl = s.hero_video_url || "";
  const ytVideoId = parseYouTubeId(videoUrl);
  const isVideoDirty = normalizeVideoUrl(videoUrl) !== normalizeVideoUrl(initialVideoUrl);

  return (
    <>
      <PageHead
        title="Site settings"
        hint="Manage key site configurations, welcome video, and primary channels."
      />
      <form onSubmit={saveAll} className="max-w-2xl space-y-8">
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
                onClick={() => {
                  set("hero_video_url", "");
                  setVideoNote(null);
                }}
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
                type="text"
                inputMode="url"
                placeholder="https://www.youtube.com/watch?v=... or youtu.be/..."
                value={videoUrl}
                onChange={(e) => {
                  set("hero_video_url", e.target.value);
                  setVideoNote(null);
                }}
                onBlur={(e) => {
                  const norm = normalizeVideoUrl(e.target.value);
                  if (norm !== e.target.value) {
                    set("hero_video_url", norm);
                  }
                }}
                className={inputClass}
              />
            </Label>
          ) : (
            <FileUpload
              label="Upload MP4 Video file"
              folder="hero-video"
              accept="video/*"
              value={videoUrl}
              onChange={(u) => {
                set("hero_video_url", u);
                setVideoNote(null);
              }}
              hint="Uploads to cloud storage. For large files, pasting a YouTube link is recommended."
            />
          )}

          {/* Quick Save button right in the video box */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              disabled={busy}
              onClick={() => saveAll()}
              className="rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-paper dark:bg-paper dark:text-ink hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {busy ? "Saving…" : "Save video"}
            </button>

            {isVideoDirty ? (
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                ● Unsaved changes — click &quot;Save video&quot;
              </span>
            ) : videoUrl ? (
              <div className="flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>
                  {ytVideoId ? "YouTube video active" : "Video active"}:{" "}
                  <span className="font-mono truncate max-w-xs inline-block align-bottom">{videoUrl}</span>
                </span>
              </div>
            ) : (
              <span className="text-xs text-ink/50 dark:text-paper/50">Section is currently hidden</span>
            )}
          </div>

          {videoNote && (
            <Notice kind={videoNote.kind}>{videoNote.text}</Notice>
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
              type="text"
              inputMode="url"
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
          {busy ? "Saving…" : "Save all settings"}
        </Btn>
      </form>
    </>
  );
}
