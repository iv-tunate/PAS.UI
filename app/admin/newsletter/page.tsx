"use client";

import { useEffect, useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import { shortDateTime } from "@/lib/format";
import { Badge, Btn, inputClass, Label, Notice, PageHead, errText, useLoad } from "@/components/admin/kit";

type Campaign = { id: string; subject: string; status: string; total: number; sent: number; failed: number; created_at: string };

export default function NewsletterPage() {
  const { data: campaigns, reload } = useLoad(() => api.get<Campaign[]>("/admin/newsletters", true));
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ kind: "ok" | "error" | "warn"; text: string } | null>(null);
  const [confirm, setConfirm] = useState(false);

  // While something is sending, check progress every few seconds.
  const sending = campaigns?.some((c) => c.status === "sending");
  useEffect(() => {
    if (!sending) return;
    const t = setInterval(reload, 4000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sending]);

  async function test() {
    setBusy(true);
    setNote(null);
    try {
      const r = await api.post<unknown>("/admin/newsletters/test", { subject, body }, true);
      void r;
      setNote({ kind: "ok", text: "A test copy was sent to your own email. Check it before sending to everyone." });
    } catch (e) {
      setNote({ kind: "error", text: errText(e) });
    }
    setBusy(false);
  }

  async function sendAll(e: FormEvent) {
    e.preventDefault();
    if (!confirm) return setConfirm(true);
    setBusy(true);
    setNote(null);
    try {
      await api.post("/admin/newsletters", { subject, body }, true);
      setNote({ kind: "ok", text: "Sending has started. You can leave this page; progress shows below." });
      setSubject("");
      setBody("");
      reload();
    } catch (err) {
      setNote({ kind: "error", text: errText(err) });
    }
    setConfirm(false);
    setBusy(false);
  }

  return (
    <>
      <PageHead title="Newsletter" hint="Write once, send to every subscriber. Each email carries its own unsubscribe link." />
      <form onSubmit={sendAll} className="max-w-2xl space-y-5">
        <Label text="Subject"><input required maxLength={150} value={subject} onChange={(e) => { setSubject(e.target.value); setConfirm(false); }} className={inputClass} /></Label>
        <Label text="Message" hint="Leave a blank line between paragraphs. Links turn clickable by themselves."><textarea required rows={12} maxLength={20000} value={body} onChange={(e) => { setBody(e.target.value); setConfirm(false); }} className={`${inputClass} leading-relaxed`} /></Label>
        {/* <Notice kind="warn">Free email plans (such as Brevo’s) cap how many emails go out per day, often around 300. A bigger list may need more than a day or a paid plan.</Notice> */}
        {note && <Notice kind={note.kind}>{note.text}</Notice>}
        <div className="flex flex-wrap gap-3">
          <Btn kind="ghost" disabled={busy || !subject || !body} onClick={test}>Send me a test</Btn>
          <Btn type="submit" disabled={busy || !subject || !body}>{confirm ? "Yes, send to everyone now" : "Send to all subscribers"}</Btn>
          {confirm && <Btn kind="ghost" onClick={() => setConfirm(false)}>Not yet</Btn>}
        </div>
      </form>

      <h2 className="mb-4 mt-14 font-display text-lg font-semibold">Past newsletters</h2>
      {campaigns && campaigns.length === 0 && <p className="text-sm text-ink/60 dark:text-paper/60">None sent yet.</p>}
      <ul className="divide-y divide-ink/10 dark:divide-paper/10">
        {campaigns?.map((c) => (
          <li key={c.id} className="flex flex-wrap items-center gap-3 py-3 text-sm">
            <span className="min-w-0 flex-1 truncate font-medium">{c.subject}</span>
            <span className="text-ink/55 dark:text-paper/55">{shortDateTime(c.created_at)}</span>
            <span>{c.sent} of {c.total} sent{c.failed > 0 ? `, ${c.failed} failed` : ""}</span>
            <Badge tone={c.status === "done" ? "good" : c.status === "sending" ? "warn" : "bad"}>{c.status === "done" ? "Done" : c.status === "sending" ? "Sending…" : "Interrupted"}</Badge>
          </li>
        ))}
      </ul>
    </>
  );
}
