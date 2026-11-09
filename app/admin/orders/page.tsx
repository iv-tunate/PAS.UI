"use client";

import { useState } from "react";
import { api, listPage } from "@/lib/api";
import { naira, dollars, shortDateTime } from "@/lib/format";
import { Badge, Btn, Empty, Notice, PageHead, errText, useLoad } from "@/components/admin/kit";

type Order = {
  id: string; kind: string; item_title: string; buyer_name: string; buyer_email: string; buyer_phone: string;
  gateway: string; reference: string; amount: number; currency: string; status: string;
  download_count: number; delivered: boolean; created_at: string;
};

const FILTERS = [["", "All"], ["success", "Paid"], ["pending", "Waiting"], ["failed", "Failed"]] as const;

export default function OrdersPage() {
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const { data, error } = useLoad(() => listPage<Order>(`/admin/orders${status ? `?status=${status}` : ""}`, page, 20), [status, page]);

  async function resend(o: Order) {
    setMsg(null);
    try {
      await api.post(`/admin/orders/${o.id}/resend`, undefined, true);
      setMsg({ kind: "ok", text: `Email queued for ${o.buyer_email}.` });
    } catch (e) {
      setMsg({ kind: "error", text: errText(e) });
    }
  }

  const amount = (o: Order) => (o.gateway === "free" || o.amount === 0 ? "Free" : o.currency === "USD" ? dollars(o.amount) : naira(o.amount));
  const pages = data ? Math.max(1, Math.ceil(data.total / data.perPage)) : 1;

  return (
    <>
      <PageHead title="Orders" hint="" />
      {/* <PageHead title="Orders" hint="Everyone who got a book or teaching. If someone says the email never came, use Resend." /> */}
      <div className="mb-5 flex flex-wrap gap-2">
        {FILTERS.map(([v, l]) => (
          <button key={v} onClick={() => { setStatus(v); setPage(1); }} className={`rounded-full border px-4 py-1.5 text-sm ${status === v ? "border-transparent bg-ink text-paper dark:bg-paper dark:text-ink" : "border-ink/20 dark:border-paper/20"}`}>
            {l}
          </button>
        ))}
      </div>
      {msg && <div className="mb-4"><Notice kind={msg.kind}>{msg.text}</Notice></div>}
      {error && <Notice kind="error">{error}</Notice>}
      {data && data.items.length === 0 && <Empty>No orders here yet.</Empty>}
      {data && data.items.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-ink/50 dark:text-paper/50">
              <tr><th className="py-2 pr-4">When</th><th className="pr-4">Buyer</th><th className="pr-4">Item</th><th className="pr-4">Amount</th><th className="pr-4">Status</th><th /></tr>
            </thead>
            <tbody className="divide-y divide-ink/10 dark:divide-paper/10">
              {data.items.map((o) => (
                <tr key={o.id} className="align-top">
                  <td className="py-3 pr-4 text-ink/60 dark:text-paper/60">{shortDateTime(o.created_at)}</td>
                  <td className="pr-4"><p className="font-medium">{o.buyer_name}</p><p className="text-ink/60 dark:text-paper/60">{o.buyer_email}</p><p className="text-ink/60 dark:text-paper/60">{o.buyer_phone}</p></td>
                  <td className="pr-4">{o.item_title}<p className="text-xs text-ink/50 dark:text-paper/50">{o.kind === "book" ? "Book" : "Teaching"}</p></td>
                  <td className="pr-4">{amount(o)}</td>
                  <td className="pr-4">
                    <Badge tone={o.status === "success" ? "good" : o.status === "failed" ? "bad" : "warn"}>{o.status === "success" ? "Paid" : o.status === "failed" ? "Failed" : "Waiting"}</Badge>
                    {o.status === "success" && <p className="mt-1 text-xs text-ink/50 dark:text-paper/50">{o.delivered ? `Emailed · opened ${o.download_count}×` : "Not emailed yet"}</p>}
                  </td>
                  <td className="text-right">{o.status === "success" && <Btn kind="ghost" className="!px-3 !py-1" onClick={() => resend(o)}>Resend email</Btn>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {data && pages > 1 && (
        <div className="mt-6 flex items-center gap-4 text-sm">
          <Btn kind="ghost" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Btn>
          <span>Page {page} of {pages}</span>
          <Btn kind="ghost" disabled={page >= pages} onClick={() => setPage(page + 1)}>Next</Btn>
        </div>
      )}
    </>
  );
}
