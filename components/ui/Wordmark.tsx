
import ASLogo from "./ASLogo";

export default function Wordmark({
  size = "md",
  showLogo = true,
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  showLogo?: boolean;
  className?: string;
}) {
  const scale =
    size === "lg" ? "text-2xl md:text-3xl" : size === "sm" ? "text-base" : "text-lg md:text-xl";
  const logoSize = size === "lg" ? 42 : size === "sm" ? 28 : 34;

  return (
    <span className={`inline-flex items-center gap-2.5 leading-none tracking-tight whitespace-nowrap ${className}`}>
      {showLogo && <ASLogo size={logoSize} />}
      <span className={`font-display font-medium text-ink dark:text-paper tracking-tight ${scale}`}>
        <span>Akintola</span>{" "}
        <span className="text-ink/80 dark:text-paper/80 font-normal">Samuel</span>
      </span>
    </span>
  );
}
