"use client";

import { useState, type FormEvent } from "react";
import { api } from "@/lib/api";
import { priceLabel } from "@/lib/format";
import Modal from "@/components/admin/Modal";
import { Badge, Btn, DeleteBtn, Empty, FileUpload, FreePaid, inputClass, Label, MoneyInputs, Notice, PageHead, Toggle, errText, useLoad } from "@/components/admin/kit";

type Book = {
  id: string; title: string; author: string; description: string; cover_image_url: string; file_url: string;
  is_free: boolean; price_kobo: number; price_usd_cents: number; is_published: boolean;
};

const BLANK: Omit<Book, "id"> = {
  title: "", author: "Akintola Samuel", description: "", cover_image_url: "", file_url: "",
  is_free: true, price_kobo: 0, price_usd_cents: 0, is_published: true,
};

export default function BooksAdmin() {
  const { data, error, reload } = useLoad(() => api.get<Book[]>("/admin/books", true));
  const [editing, setEditing] = useState<(Omit<Book, "id"> & { id?: string }) | null>(null);
  const [msg, setMsg] = useState("");

  async function remove(b: Book) {
    try {
      await api.delete(`/admin/books/${b.id}`, true);
      reload();
    } catch (e) {
      setMsg(errText(e));
    }
  }

  return (
    <>
      <PageHead
        title="Books"
        hint="Upload the book file, choose free or paid, and publish. Buyers receive a download link by email."
        action={<Btn onClick={() => setEditing({ ...BLANK })}>Add a book</Btn>}
      />
      {(error || msg) && <Notice kind="error">{error || msg}</Notice>}
      {data && data.length === 0 && <Empty>No books yet. Click “Add a book”.</Empty>}
      <ul className="divide-y divide-ink/10 dark:divide-paper/10">
        {data?.map((b) => (
          <li key={b.id} className="flex flex-wrap items-center gap-4 py-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={b.cover_image_url || "/demo/book-placeholder.svg"} alt="" className="h-20 w-14 border border-ink/10 object-cover dark:border-paper/10" />
            <div className="min-w-0 flex-1">
              <p className="font-medium">{b.title}</p>
              <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink/60 dark:text-paper/60">
                <Badge tone={b.is_free ? "good" : "plain"}>{priceLabel(b)}</Badge>
                {b.is_published && b.file_url ? <Badge tone="good">Live</Badge> : b.is_published ? <Badge tone="warn">Hidden: no file yet</Badge> : <Badge>Draft</Badge>}
              </p>
            </div>
            <Btn kind="ghost" className="!px-4 !py-1.5" onClick={() => setEditing(b)}>Edit</Btn>
            <DeleteBtn onConfirm={() => remove(b)} />
          </li>
        ))}
      </ul>
      {editing && <BookForm initial={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); reload(); }} />}
    </>
  );
}

function BookForm({ initial, onClose, onSaved }: { initial: Omit<Book, "id"> & { id?: string }; onClose: () => void; onSaved: () => void }) {
  const [b, setB] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = <K extends keyof Book>(k: K, v: Book[K]) => setB((p) => ({ ...p, [k]: v }));

  async function save(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (!b.is_free && b.price_kobo <= 0 && b.price_usd_cents <= 0) return setError("A paid book needs a price. Or switch it to Free.");
    setBusy(true);
    try {
      const body = { ...b, price_kobo: b.is_free ? 0 : b.price_kobo, price_usd_cents: b.is_free ? 0 : b.price_usd_cents };
      if (b.id) await api.put(`/admin/books/${b.id}`, body, true);
      else await api.post("/admin/books", body, true);
      onSaved();
    } catch (err) {
      setError(errText(err));
      setBusy(false);
    }
  }

  return (
    <Modal title={b.id ? "Edit book" : "Add a book"} onClose={onClose} wide>
      <form onSubmit={save} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Label text="Title"><input required maxLength={200} value={b.title} onChange={(e) => set("title", e.target.value)} className={inputClass} /></Label>
          <Label text="Author"><input maxLength={120} value={b.author} onChange={(e) => set("author", e.target.value)} className={inputClass} /></Label>
        </div>
        <Label text="Description"><textarea rows={4} maxLength={3000} value={b.description} onChange={(e) => set("description", e.target.value)} className={inputClass} /></Label>
        <FileUpload label="Cover picture" folder="book-covers" accept="image/*" image value={b.cover_image_url} onChange={(u) => set("cover_image_url", u)} hint="Portrait works best (3:4)." />
        <FileUpload label="The book file" folder="books" accept=".pdf,.epub,.mobi,.zip,application/pdf,application/epub+zip" value={b.file_url} onChange={(u) => set("file_url", u)} hint="PDF or EPUB. This is what buyers receive. It is never shown on the website." />
        <div className="space-y-4">
          <p className="text-sm font-medium">Price</p>
          <FreePaid free={b.is_free} onChange={(v) => set("is_free", v)} />
          {!b.is_free && <MoneyInputs kobo={b.price_kobo} cents={b.price_usd_cents} onKobo={(v) => set("price_kobo", v)} onCents={(v) => set("price_usd_cents", v)} />}
        </div>
        <Toggle checked={b.is_published} onChange={(v) => set("is_published", v)} label="Show on the website" hint={!b.file_url ? "Until a file is uploaded the book stays hidden from visitors." : undefined} />
        {error && <Notice kind="error">{error}</Notice>}
        <div className="flex gap-3"><Btn type="submit" disabled={busy}>{busy ? "Saving…" : "Save book"}</Btn><Btn kind="ghost" onClick={onClose}>Cancel</Btn></div>
      </form>
    </Modal>
  );
}
