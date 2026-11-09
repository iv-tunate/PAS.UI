const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export const monthName = (m: number) => MONTHS[m - 1] ?? "";
export const MONTH_NAMES = MONTHS;

/**
 * "July 1–6", "October 2", "October", or "" when the event has no date.
 * Month 0 means no date. Day 0 means "somewhere in the month".
 */
export function eventDateLabel(month: number, dayStart: number, dayEnd: number): string {
  if (!month) return "";
  const m = monthName(month);
  if (!dayStart) return m;
  if (!dayEnd || dayEnd === dayStart) return `${m} ${dayStart}`;
  return `${m} ${dayStart}–${dayEnd}`;
}

export function naira(kobo: number): string {
  const n = kobo / 100;
  return `₦${n.toLocaleString("en-NG", { maximumFractionDigits: n % 1 ? 2 : 0 })}`;
}

export function dollars(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: cents % 100 ? 2 : 0, maximumFractionDigits: 2 })}`;
}

type Priced = { is_free: boolean; price_kobo: number; price_usd_cents: number };

export function priceLabel(item: Priced): string {
  if (item.is_free) return "Free";
  // Show NGN if set, otherwise fall back to USD. Never "₦X or $Y" — the two
  // amounts are set by the admin independently and are not equivalent.
  if (item.price_kobo > 0) return naira(item.price_kobo);
  if (item.price_usd_cents > 0) return dollars(item.price_usd_cents);
  return "Free";
}

export function longDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00` : iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export function shortDateTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
}
