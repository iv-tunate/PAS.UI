export default function ASLogo({
  size = 36,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  const radius = Math.round(size * 0.22);
  const fontSize = Math.round(size * 0.44);

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center bg-ink text-paper shadow-sm ring-1 ring-black/10 dark:ring-white/15 select-none ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
      }}
      aria-hidden="true"
    >
      <span
        className="font-display font-medium text-white tracking-tight"
        style={{
          fontSize,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          transform: "translateY(0.5px)",
        }}
      >
        AS
      </span>
    </span>
  );
}

