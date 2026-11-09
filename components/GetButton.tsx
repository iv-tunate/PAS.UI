"use client";

import { useEffect, useState, type FormEvent } from "react";
import { api, ApiError } from "@/lib/api";
import { isDemoId } from "@/lib/demo-content";
import { priceLabel } from "@/lib/format";
import Button from "./ui/Button";
import Modal from "./admin/Modal";

export type Buyable = {
  kind: "book" | "course";
  id: string;
  title: string;
  is_free: boolean;
  price_kobo: number;
  price_usd_cents: number;
};

type Gateway = "paystack" | "flutterwave" | "stripe";
const GATEWAY_LABEL: Record<Gateway, string> = {
  paystack: "Pay in naira (card, bank, transfer)",
  flutterwave: "Pay in naira (card, bank, transfer)",
  stripe: "Pay in dollars (international card)",
};

type Result = { reference: string; free: boolean; checkout_url?: string };

/**
 * One button for books and courses. Free items: name, email and phone, then
 * the link is emailed. Paid items: the same form, then on to the payment page;
 * the link is emailed when the payment clears. No accounts anywhere.
 */
export default function GetButton({
  item,
  label,
  variant = "primary",
  className = "",
}: {
  item: Buyable;
  label?: string;
  variant?: "primary" | "outline";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const text = label ?? (item.is_free ? "Get it free" : "Buy now");
  return (
    <>
      <Button variant={variant} onClick={() => setOpen(true)} className={className}>
        {text}
      </Button>
      {open && <CheckoutModal item={item} onClose={() => setOpen(false)} />}
    </>
  );
}

const inputClass =
  "w-full border border-ink/20 bg-transparent px-3 py-2.5 text-base outline-none focus:border-brand-violet dark:border-paper/20 dark:focus:border-brand-sky";

function CheckoutModal({ item, onClose }: { item: Buyable; onClose: () => void }) {
  const demo = isDemoId(item.id);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subscribe, setSubscribe] = useState(false);
  const [gateway, setGateway] = useState<Gateway | "">("");
  const [options, setOptions] = useState<Gateway[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sentTo, setSentTo] = useState("");

  // Only the payment methods that are switched on AND that this item has a price for.
  useEffect(() => {
    if (item.is_free || demo) return;
    api
      .get<{ gateways: Gateway[] }>("/checkout/gateways")
      .then((r) => {
        const usable = (r.gateways || []).filter((g) => (g === "stripe" ? item.price_usd_cents > 0 : item.price_kobo > 0));
        // Paystack and Flutterwave are the same thing to a buyer: keep the first.
        const unique = usable.filter((g, i) => g === "stripe" || usable.findIndex((x) => x !== "stripe") === i);
        setOptions(unique);
        setGateway(unique[0] ?? "");
      })
      .catch(() => {});
  }, [item, demo]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (demo) {
      setError("This is a sample item. Add a real one from the admin dashboard to try the full flow.");
      return;
    }
    setBusy(true);
    try {
      const res = await api.post<Result>("/checkout", {
        kind: item.kind,
        item_id: item.id,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        gateway: item.is_free ? "" : gateway,
        subscribe,
      });
      if (res.free) {
        setSentTo(email.trim());
      } else if (res.checkout_url && res.checkout_url.startsWith("https://")) {
        window.location.assign(res.checkout_url);
        return; // leaving the page; keep the button disabled
      } else {
        throw new Error("no payment link");
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
    setBusy(false);
  }

  if (sentTo) {
    return (
      <Modal title="Check your email" onClose={onClose}>
        <p className="leading-relaxed text-ink/75 dark:text-paper/75">
          We have sent the link for <strong>{item.title}</strong> to <strong>{sentTo}</strong>. It usually arrives within a
          minute. If you cannot see it, look in your spam or promotions folder.
        </p>
        <div className="mt-6">
          <Button onClick={onClose}>Done</Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title={item.title} onClose={onClose}>
      <p className="mb-5 text-sm text-ink/65 dark:text-paper/65">
        {item.is_free
          ? "Free download. Fill in your details and the link will be emailed to you."
          : `${priceLabel(item)}. The link is emailed as soon as the payment clears.`}
      </p>

      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm">
          Your name
          <input
            required
            minLength={2}
            maxLength={100}
            autoComplete="name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`${inputClass} mt-1.5`}
          />
        </label>
        <label className="block text-sm">
          Email address
          <input
            required
            type="email"
            maxLength={200}
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${inputClass} mt-1.5`}
          />
        </label>
        <label className="block text-sm">
          Phone number
          <input
            required
            type="tel"
            maxLength={30}
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className={`${inputClass} mt-1.5`}
          />
        </label>

        {options.length > 1 && (
          <fieldset className="space-y-2">
            <legend className="mb-1 text-sm">How would you like to pay?</legend>
            {options.map((g) => (
              <label key={g} className="flex cursor-pointer items-center gap-3 text-sm">
                <input type="radio" name="gateway" checked={gateway === g} onChange={() => setGateway(g)} />
                {GATEWAY_LABEL[g]}
              </label>
            ))}
          </fieldset>
        )}

        <label className="flex cursor-pointer items-start gap-3 text-sm text-ink/70 dark:text-paper/70">
          <input type="checkbox" checked={subscribe} onChange={(e) => setSubscribe(e.target.checked)} className="mt-1" />
          Also email me when new messages, books and events are released.
        </label>

        {error && (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <Button type="submit" disabled={busy}>
            {busy ? "One moment…" : item.is_free ? "Email me the link" : "Continue to payment"}
          </Button>
          <Button variant="ghost" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
