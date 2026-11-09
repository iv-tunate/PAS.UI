import type { ReactNode } from "react";

type Variant = "aurora-a" | "aurora-b" | "lattice";

/**
 * Section background: slow-drifting colour from the logo gradient, or a
 * faint hexagon lattice. Orbs are plain radial gradients (no blur
 * filters) so a page full of them stays cheap to paint.
 */
const LAYERS: Record<Variant, ReactNode> = {
  "aurora-a": (
    <>
      <i className="orb orb-sky drift-a -left-[12%] -top-[18%] h-[640px] w-[640px]" />
      <i className="orb orb-magenta drift-b -right-[14%] -bottom-[22%] h-[600px] w-[600px]" />
    </>
  ),
  "aurora-b": (
    <>
      <i className="orb orb-violet drift-b -right-[10%] top-[8%] h-[700px] w-[700px]" />
      <i className="orb orb-sky drift-a -left-[16%] -bottom-[20%] h-[540px] w-[540px]" />
    </>
  ),
  lattice: (
    <>
      <div className="lattice absolute inset-0" />
      <i className="orb orb-violet drift-a left-[30%] -top-[30%] h-[620px] w-[620px]" />
    </>
  ),
};

export default function Backdrop({
  variant,
  children,
  className = "",
}: {
  variant: Variant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative isolate overflow-hidden ${className}`}>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {LAYERS[variant]}
      </div>
      {children}
    </div>
  );
}
