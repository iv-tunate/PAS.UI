import type { ReactNode } from "react";

/**
 * The eyebrow + heading pair that opens every homepage section
 * (Courses, Books, Philosophy, About…). Pulled into one component so
 * the label style, spacing, and heading scale can't drift apart
 * section to section.
 */
export default function SectionIntro({
  eyebrow,
  heading,
  className = "",
}: {
  eyebrow: string;
  heading: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="text-sm text-brand-violet dark:text-brand-sky mb-3">{eyebrow}</p>
      <h2 className="font-display font-semibold text-3xl md:text-4xl max-w-xl text-ink dark:text-paper">
        {heading}
      </h2>
    </div>
  );
}
