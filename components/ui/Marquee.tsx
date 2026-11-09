/** Elegant moving ticker for roles. Subtle, beautifully spaced, pauses on hover. */
export default function Marquee({ items }: { items: string[] }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-8 pr-8" aria-hidden={hidden}>
      {items.map((t, idx) => (
        <li key={`${t}-${idx}`} className="flex items-center gap-8">
          <span className="font-sans text-xs sm:text-sm md:text-base font-semibold tracking-[0.22em] uppercase text-ink/75 dark:text-paper/75 whitespace-nowrap">
            {t}
          </span>
          <span
            className="h-1.5 w-1.5 rounded-full bg-brand-gradient shrink-0 opacity-80"
            aria-hidden
          />
        </li>
      ))}
    </ul>
  );
  return (
    <div className="marquee overflow-hidden border-y border-ink/10 dark:border-paper/10 bg-paper/40 dark:bg-ink/40 backdrop-blur-sm py-4 md:py-5">
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
