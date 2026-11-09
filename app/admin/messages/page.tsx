"use client";

import { useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import { longDate } from "@/lib/format";
import { parseYouTubeId, ytThumb, ytWatchUrl } from "@/lib/youtube";
import Modal from "@/components/admin/Modal";
import { Badge, Btn, DeleteBtn, Empty, inputClass, Label, Notice, PageHead, Toggle, errText, useLoad } from "@/components/admin/kit";

type Msg = { id: string; title: string; description: string; youtube_id: string; preached_on: string; is_published: boolean };
type Draft = { id?: string; title: string; description: string; youtube_url: string; preached_on: string; is_published: boolean };

const BLANK: Draft = { title: "", description: "", youtube_url: "", preached_on: "", is_published: true };

export default function MessagesAdmin() {
  const { data, error, reload } = useLoad(() => api.get<Msg[]>("/admin/messages", true));
  const [editing, setEditing] = useState<Draft | null>(null);
  const [msg, setMsg] = useState("");

  async function remove(m: Msg) {
    try { await api.delete(`/admin/messages/${m.id}`, true); reload(); } catch (e) { setMsg(errText(e)); }
  }

  return (
    <>
      <PageHead
        title="Messages"
        hint="Paste a YouTube link, add a title, done. Visitors see a thumbnail and watch right on the site."
        action={<Btn onClick={() => setEditing({ ...BLANK })}>Add a message</Btn>}
      />
      {(error || msg) && <Notice kind="error">{error || msg}</Notice>}
      {data && data.length === 0 && <Empty>No messages yet. Click “Add a message”.</Empty>}
      <ul className="divide-y divide-ink/10 dark:divide-paper/10">
        {data?.map((m) => (
          <li key={m.id} className="flex flex-wrap items-center gap-4 py-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ytThumb(m.youtube_id)} alt="" className="h-16 w-28 object-cover" />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{m.title}</p>
              <p className="mt-1 flex items-center gap-2 text-sm text-ink/60 dark:text-paper/60">
                {m.preached_on && <span>{longDate(m.preached_on)}</span>}
                {!m.is_published && <Badge>Hidden</Badge>}
              </p>
            </div>
            <Btn kind="ghost" className="!px-4 !py-1.5" onClick={() => setEditing({ id: m.id, title: m.title, description: m.description, youtube_url: ytWatchUrl(m.youtube_id), preached_on: m.preached_on, is_published: m.is_published })}>Edit</Btn>
            <DeleteBtn onConfirm={() => remove(m)} />
          </li>
        ))}
      </ul>
      {editing && <Form initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); reload(); }} />}
    </>
  );
}

function Form({ initial, onClose, onSaved }: { initial: Draft; onClose: () => void; onSaved: () => void }) {
  const [m, setM] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const id = parseYouTubeId(m.youtube_url);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setM((p) => ({ ...p, [k]: v }));

  async function save(e: FormEvent) {
    e.preventDefault();
    if (!id) return setError("That does not look like a YouTube link. Paste the link from the video's Share button.");
    setBusy(true);
    setError("");
    try {
      if (m.id) await api.put(`/admin/messages/${m.id}`, m, true);
      else await api.post("/admin/messages", m, true);
      onSaved();
    } catch (err) {
      setError(errText(err));
      setBusy(false);
    }
  }

  return (
    <Modal title={m.id ? "Edit message" : "Add a message"} onClose={onClose}>
      <form onSubmit={save} className="space-y-5">
        <Label text="YouTube link"><input required value={m.youtube_url} onChange={(e) => set("youtube_url", e.target.value)} placeholder="https://youtu.be/…" className={inputClass} /></Label>
        {id && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ytThumb(id)} alt="Thumbnail preview" className="aspect-video w-full max-w-xs object-cover" />
        )}
        <Label text="Title"><input required maxLength={200} value={m.title} onChange={(e) => set("title", e.target.value)} className={inputClass} /></Label>
        <Label text="Date preached" hint="Optional"><input type="date" value={m.preached_on} onChange={(e) => set("preached_on", e.target.value)} className={inputClass} /></Label>
        <Label text="Short note" hint="Optional"><textarea rows={3} maxLength={1000} value={m.description} onChange={(e) => set("description", e.target.value)} className={inputClass} /></Label>
        <Toggle checked={m.is_published} onChange={(v) => set("is_published", v)} label="Show on the website" />
        {error && <Notice kind="error">{error}</Notice>}
        <div className="flex gap-3"><Btn type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</Btn><Btn kind="ghost" onClick={onClose}>Cancel</Btn></div>
      </form>
    </Modal>
  );
}
