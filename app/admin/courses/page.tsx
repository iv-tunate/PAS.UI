"use client";

import { useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import { priceLabel } from "@/lib/format";
import Modal from "@/components/admin/Modal";
import { Badge, Btn, DeleteBtn, Empty, FileUpload, FreePaid, inputClass, Label, MoneyInputs, Notice, PageHead, Toggle, errText, useLoad } from "@/components/admin/kit";

type Kind = "video" | "audio" | "file";
type Course = {
  id: string; title: string; summary: string; thumbnail_url: string; media_kind: Kind; file_url: string;
  is_free: boolean; price_kobo: number; price_usd_cents: number; is_published: boolean;
  chapters: { title: string; position: number }[] | null;
};
type Draft = Omit<Course, "id" | "chapters"> & { id?: string; chapters: string };

const KIND_LABEL: Record<Kind, string> = { video: "Video", audio: "Audio", file: "Document / file" };
const ACCEPT: Record<Kind, string> = { video: "video/*", audio: "audio/*", file: ".pdf,.zip,.epub,.doc,.docx,.ppt,.pptx" };

const BLANK: Draft = {
  title: "", summary: "", thumbnail_url: "", media_kind: "video", file_url: "", is_free: true,
  price_kobo: 0, price_usd_cents: 0, is_published: true, chapters: "",
};

export default function CoursesAdmin() {
  const { data, error, reload } = useLoad(() => api.get<Course[]>("/admin/courses", true));
  const [editing, setEditing] = useState<Draft | null>(null);
  const [msg, setMsg] = useState("");

  async function remove(c: Course) {
    try { await api.delete(`/admin/courses/${c.id}`, true); reload(); } catch (e) { setMsg(errText(e)); }
  }
  const toDraft = (c: Course): Draft => ({ ...c, chapters: (c.chapters ?? []).map((x) => x.title).join("\n") });

  return (
    <>
      <PageHead
        title="Relearn"
        // hint="Videos, audio or files, free or paid. Visitors see the thumbnail, the type and the price. The link is emailed after they get it or pay."
        action={<Btn onClick={() => setEditing({ ...BLANK })}>Add a teaching</Btn>}
      />
      {(error || msg) && <Notice kind="error">{error || msg}</Notice>}
      {data && data.length === 0 && <Empty>No relearn content.</Empty>}
      <ul className="divide-y divide-ink/10 dark:divide-paper/10">
        {data?.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center gap-4 py-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={c.thumbnail_url || "/demo/course-placeholder.svg"} alt="" className="h-16 w-28 border border-ink/10 object-cover dark:border-paper/10" />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{c.title}</p>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                <Badge>{KIND_LABEL[c.media_kind]}</Badge>
                <Badge tone={c.is_free ? "good" : "plain"}>{priceLabel(c)}</Badge>
                {c.is_published && c.file_url ? <Badge tone="good">Live</Badge> : c.is_published ? <Badge tone="warn">Hidden: no file yet</Badge> : <Badge>Draft</Badge>}
              </p>
            </div>
            <Btn kind="ghost" className="!px-4 !py-1.5" onClick={() => setEditing(toDraft(c))}>Edit</Btn>
            <DeleteBtn onConfirm={() => remove(c)} />
          </li>
        ))}
      </ul>
      {editing && <CourseForm initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); reload(); }} />}
    </>
  );
}

function CourseForm({ initial, onClose, onSaved }: { initial: Draft; onClose: () => void; onSaved: () => void }) {
  const [c, setC] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setC((p) => ({ ...p, [k]: v }));

  async function save(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!c.is_free && c.price_kobo <= 0 && c.price_usd_cents <= 0) return setError("A paid teaching needs a price. Or switch it to Free.");
    setBusy(true);
    try {
      const body = {
        ...c,
        price_kobo: c.is_free ? 0 : c.price_kobo,
        price_usd_cents: c.is_free ? 0 : c.price_usd_cents,
        chapters: c.chapters.split("\n").map((x) => x.trim()).filter(Boolean),
      };
      if (c.id) await api.put(`/admin/courses/${c.id}`, body, true);
      else await api.post("/admin/courses", body, true);
      onSaved();
    } catch (err) {
      setError(errText(err));
      setBusy(false);
    }
  }

  return (
    <Modal title={c.id ? "Edit teaching" : "Add a teaching"} onClose={onClose} wide>
      <form onSubmit={save} className="space-y-6">
        <Label text="Title"><input required maxLength={200} value={c.title} onChange={(e) => set("title", e.target.value)} className={inputClass} /></Label>
        <Label text="Short summary"><textarea rows={3} maxLength={1000} value={c.summary} onChange={(e) => set("summary", e.target.value)} className={inputClass} /></Label>
        <FileUpload label="Thumbnail picture" folder="courses" accept="image/*" image value={c.thumbnail_url} onChange={(u) => set("thumbnail_url", u)} hint="Landscape (16:9) works best." />

        <div>
          <p className="mb-2 text-sm font-medium">What is it?</p>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(KIND_LABEL) as Kind[]).map((k) => (
              <button key={k} type="button" onClick={() => set("media_kind", k)} className={`rounded-full border px-4 py-1.5 text-sm ${c.media_kind === k ? "border-transparent bg-ink text-paper dark:bg-paper dark:text-ink" : "border-ink/20 dark:border-paper/20"}`}>
                {KIND_LABEL[k]}
              </button>
            ))}
          </div>
        </div>
        <FileUpload
          label={`The ${KIND_LABEL[c.media_kind].toLowerCase()} file`}
          folder="course-files"
          accept={ACCEPT[c.media_kind]}
          value={c.file_url}
          onChange={(u) => set("file_url", u)}
          hint="This is what the buyer is emailed. It is never shown on the website. Large videos can take a few minutes."
        />

        <div className="space-y-4">
          <p className="text-sm font-medium">Price</p>
          <FreePaid free={c.is_free} onChange={(v) => set("is_free", v)} />
          {!c.is_free && <MoneyInputs kobo={c.price_kobo} cents={c.price_usd_cents} onKobo={(v) => set("price_kobo", v)} onCents={(v) => set("price_usd_cents", v)} />}
        </div>

        <Label text="What is inside" hint="Optional. One line each."><textarea rows={4} value={c.chapters} onChange={(e) => set("chapters", e.target.value)} className={inputClass} placeholder={"Part one\nPart two"} /></Label>
        <Toggle checked={c.is_published} onChange={(v) => set("is_published", v)} label="Show on the website" hint={!c.file_url ? "Until a file is uploaded this stays hidden from visitors." : undefined} />
        {error && <Notice kind="error">{error}</Notice>}
        <div className="flex gap-3"><Btn type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</Btn><Btn kind="ghost" onClick={onClose}>Cancel</Btn></div>
      </form>
    </Modal>
  );
}
