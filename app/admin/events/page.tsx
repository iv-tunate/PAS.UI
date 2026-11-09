"use client";

import { useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import { MONTH_NAMES, eventDateLabel } from "@/lib/format";
import Modal from "@/components/admin/Modal";
import { Badge, Btn, DeleteBtn, Empty, FileUpload, inputClass, Label, Notice, PageHead, Toggle, errText, useLoad } from "@/components/admin/kit";

type Ev = { id: string; name: string; description: string; month: number; day_start: number; day_end: number; flyer_url: string; position: number; is_published: boolean };

const BLANK: Omit<Ev, "id"> = { name: "", description: "", month: 0, day_start: 0, day_end: 0, flyer_url: "", position: 0, is_published: true };

export default function EventsAdmin() {
  const { data, error, reload } = useLoad(() => api.get<Ev[]>("/admin/events", true));
  const [editing, setEditing] = useState<(Omit<Ev, "id"> & { id?: string }) | null>(null);
  const [msg, setMsg] = useState("");

  // Swap places with the neighbour above or below by trading position numbers.
  function move(i: number, dir: -1 | 1) {
    const list = data ?? [];
    const a = list[i];
    const b = list[i + dir];
    if (!a || !b) return;
    let pa = b.position;
    let pb = a.position;
    if (pa === pb) {
      // Two events with the same number would not move; nudge them apart.
      pa = a.position + dir;
      pb = a.position;
    }
    return act(() => api.post(`/admin/events/${a.id}/move`, { other_id: b.id, position: pa, other_position: pb }, true));
  }

  async function act(fn: () => Promise<unknown>) {
    setMsg("");
    try { await fn(); reload(); } catch (e) { setMsg(errText(e)); }
  }

  return (
    <>
      <PageHead
        title="Events"
        hint="These rotate in the banner near the bottom of the home page. The order here is the order there."
        action={<Btn onClick={() => setEditing({ ...BLANK, position: (data?.length ?? 0) + 1 })}>Add an event</Btn>}
      />
      {(error || msg) && <Notice kind="error">{error || msg}</Notice>}
      {data && data.length === 0 && <Empty>No events yet. Click “Add an event”.</Empty>}
      <ul className="divide-y divide-ink/10 dark:divide-paper/10">
        {data?.map((e, i) => (
          <li key={e.id} className="flex flex-wrap items-center gap-4 py-4">
            <div className="flex flex-col">
              <button aria-label="Move up" disabled={i === 0} onClick={() => move(i, -1)} className="px-2 disabled:opacity-25">▲</button>
              <button aria-label="Move down" disabled={i === (data?.length ?? 0) - 1} onClick={() => move(i, 1)} className="px-2 disabled:opacity-25">▼</button>
            </div>
            {e.flyer_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={e.flyer_url} alt="" className="h-16 w-12 border border-ink/10 object-cover dark:border-paper/10" />
            ) : (
              <div className="grid h-16 w-12 place-items-center border border-dashed border-ink/20 text-[10px] text-ink/50 dark:border-paper/20 dark:text-paper/50">No flyer</div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-medium">{e.name}</p>
              <p className="mt-1 flex items-center gap-2 text-sm text-ink/60 dark:text-paper/60">
                {eventDateLabel(e.month, e.day_start, e.day_end) || "No date"}
                {!e.is_published && <Badge>Hidden</Badge>}
              </p>
            </div>
            <Btn kind="ghost" className="!px-4 !py-1.5" onClick={() => setEditing(e)}>Edit</Btn>
            <DeleteBtn onConfirm={() => act(() => api.delete(`/admin/events/${e.id}`, true))} />
          </li>
        ))}
      </ul>
      {editing && <Form initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); reload(); }} />}
    </>
  );
}

function Form({ initial, onClose, onSaved }: { initial: Omit<Ev, "id"> & { id?: string }; onClose: () => void; onSaved: () => void }) {
  const [e, setE] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = <K extends keyof Ev>(k: K, v: Ev[K]) => setE((p) => ({ ...p, [k]: v }));
  const num = (v: string) => Math.max(0, Math.min(31, Number(v) || 0));

  async function save(ev: FormEvent) {
    ev.preventDefault();
    setError("");
    if (e.day_start && !e.month) return setError("Pick a month for those days, or clear the days.");
    if (e.day_end && e.day_end < e.day_start) return setError("The last day cannot be before the first day.");
    setBusy(true);
    try {
      const body = { ...e, day_start: e.month ? e.day_start : 0, day_end: e.month && e.day_start ? e.day_end : 0 };
      if (e.id) await api.put(`/admin/events/${e.id}`, body, true);
      else await api.post("/admin/events", body, true);
      onSaved();
    } catch (err) {
      setError(errText(err));
      setBusy(false);
    }
  }

  return (
    <Modal title={e.id ? "Edit event" : "Add an event"} onClose={onClose} wide>
      <form onSubmit={save} className="space-y-5">
        <Label text="Name"><input required maxLength={120} value={e.name} onChange={(x) => set("name", x.target.value)} className={inputClass} /></Label>
        <Label text="Small description"><textarea rows={3} maxLength={400} value={e.description} onChange={(x) => set("description", x.target.value)} className={inputClass} /></Label>
        <div>
          <p className="mb-2 text-sm font-medium">When <span className="font-normal text-ink/50 dark:text-paper/50">(leave empty if there is no date)</span></p>
          <div className="grid gap-4 sm:grid-cols-3">
            <select value={e.month} onChange={(x) => set("month", Number(x.target.value))} className={inputClass} aria-label="Month">
              <option value={0}>No month</option>
              {MONTH_NAMES.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
            <input type="number" min={0} max={31} placeholder="First day" aria-label="First day" value={e.day_start || ""} onChange={(x) => set("day_start", num(x.target.value))} disabled={!e.month} className={inputClass} />
            <input type="number" min={0} max={31} placeholder="Last day (optional)" aria-label="Last day" value={e.day_end || ""} onChange={(x) => set("day_end", num(x.target.value))} disabled={!e.month || !e.day_start} className={inputClass} />
          </div>
          <p className="mt-2 text-sm text-ink/60 dark:text-paper/60">Shows as: <strong>{eventDateLabel(e.month, e.day_start, e.day_end) || "nothing, only the name"}</strong></p>
        </div>
        <FileUpload label="Flyer" folder="events" accept="image/*" image value={e.flyer_url} onChange={(u) => set("flyer_url", u)} hint="Used as the background of the banner. Wide or square pictures both work." />
        <Toggle checked={e.is_published} onChange={(v) => set("is_published", v)} label="Show on the website" />
        {error && <Notice kind="error">{error}</Notice>}
        <div className="flex gap-3"><Btn type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</Btn><Btn kind="ghost" onClick={onClose}>Cancel</Btn></div>
      </form>
    </Modal>
  );
}
