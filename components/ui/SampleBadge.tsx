/** Marks placeholder content so nobody mistakes it for the real thing. */
export default function SampleBadge({ className = "" }: { className?: string }) {
  return (
    <span className={`rounded-full bg-ink/80 px-2.5 py-1 text-[11px] font-medium text-paper backdrop-blur-sm ${className}`}>
      Sample
    </span>
  );
}
