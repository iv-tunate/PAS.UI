"use client";

import { useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Btn, DeleteBtn, inputClass, Label, Notice, PageHead, errText, useLoad } from "@/components/admin/kit";

type Admin = { id: string; full_name: string; email: string; created_at: string };

export default function AdminsPage() {
  const { user } = useAuth();
  const { data, error, reload } = useLoad(() => api.get<Admin[]>("/admin/admins", true));
  const [f, setF] = useState({ full_name: "", email: "", password: "" });
  const [pw, setPw] = useState({ current_password: "", new_password: "" });
  const [note, setNote] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [pwNote, setPwNote] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  async function add(e: FormEvent) {
    e.preventDefault();
    setNote(null);
    try {
      await api.post("/admin/admins", f, true);
      setNote({ kind: "ok", text: `${f.email} can now sign in at /admin/login.` });
      setF({ full_name: "", email: "", password: "" });
      reload();
    } catch (err) {
      setNote({ kind: "error", text: errText(err) });
    }
  }

  async function changePw(e: FormEvent) {
    e.preventDefault();
    setPwNote(null);
    try {
      await api.put("/admin/me/password", pw, true);
      setPwNote({ kind: "ok", text: "Password changed." });
      setPw({ current_password: "", new_password: "" });
    } catch (err) {
      setPwNote({ kind: "error", text: errText(err) });
    }
  }

  async function remove(a: Admin) {
    setNote(null);
    try { await api.delete(`/admin/admins/${a.id}`, true); reload(); } catch (err) { setNote({ kind: "error", text: errText(err) }); }
  }

  return (
    <>
      <PageHead title="Admins" hint="People who can sign in and manage the site. There are no visitor accounts." />
      {error && <Notice kind="error">{error}</Notice>}
      <ul className="divide-y divide-ink/10 dark:divide-paper/10">
        {data?.map((a) => (
          <li key={a.id} className="flex flex-wrap items-center gap-4 py-3 text-sm">
            <div className="min-w-0 flex-1"><p className="font-medium">{a.full_name || a.email}</p><p className="text-ink/60 dark:text-paper/60">{a.email}</p></div>
            <span className="text-ink/50 dark:text-paper/50">Added {a.created_at}</span>
            {a.id !== user?.id ? <DeleteBtn label="Remove" onConfirm={() => remove(a)} /> : <span className="text-xs text-ink/50 dark:text-paper/50">You</span>}
          </li>
        ))}
      </ul>

      <div className="mt-12 grid gap-12 lg:grid-cols-2">
        <form onSubmit={add} className="space-y-4">
          <h2 className="font-display text-lg font-semibold">Add an admin</h2>
          <Label text="Name"><input maxLength={100} value={f.full_name} onChange={(e) => setF({ ...f, full_name: e.target.value })} className={inputClass} /></Label>
          <Label text="Email"><input required type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className={inputClass} /></Label>
          <Label text="Password" hint="At least 10 characters"><input required type="password" minLength={10} maxLength={72} autoComplete="new-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} className={inputClass} /></Label>
          {note && <Notice kind={note.kind}>{note.text}</Notice>}
          <Btn type="submit">Add admin</Btn>
        </form>

        <form onSubmit={changePw} className="space-y-4">
          <h2 className="font-display text-lg font-semibold">Change my password</h2>
          <Label text="Current password"><input required type="password" autoComplete="current-password" value={pw.current_password} onChange={(e) => setPw({ ...pw, current_password: e.target.value })} className={inputClass} /></Label>
          <Label text="New password" hint="At least 10 characters"><input required type="password" minLength={10} maxLength={72} autoComplete="new-password" value={pw.new_password} onChange={(e) => setPw({ ...pw, new_password: e.target.value })} className={inputClass} /></Label>
          {pwNote && <Notice kind={pwNote.kind}>{pwNote.text}</Notice>}
          <Btn type="submit">Change password</Btn>
        </form>
      </div>
    </>
  );
}
