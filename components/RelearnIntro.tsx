import Logo from "./ui/Logo";
import Button from "./ui/Button";
import Reveal from "./ui/Reveal";
import Backdrop from "./ui/Backdrop";
import Editable from "./ui/Editable";

const hexPoints = (r: number) =>
  [0, 1, 2, 3, 4, 5]
    .map((i) => {
      const a = (Math.PI / 3) * i - Math.PI / 2;
      return `${(150 + r * Math.cos(a)).toFixed(1)},${(150 + r * Math.sin(a)).toFixed(1)}`;
    })
    .join(" ");

export default function RelearnIntro() {
  return (
    <Backdrop variant="aurora-b">
      <section className="mx-auto max-w-6xl px-6 py-24 md:py-36 grid md:grid-cols-[1fr_1.1fr] gap-16 items-center">

        {/* LEFT — spinning hex rings + floating logo (restored) */}
        <Reveal from="scale">
          <div className="relative mx-auto aspect-square w-full max-w-sm">
            <svg viewBox="0 0 300 300" className="absolute inset-0 h-full w-full" aria-hidden>
              <defs>
                <linearGradient id="rl-ring" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#1C98D8" />
                  <stop offset="1" stopColor="#C45D96" />
                </linearGradient>
              </defs>
              <g className="spin-slow" style={{ transformOrigin: "150px 150px" }}>
                <polygon points={hexPoints(142)} fill="none" stroke="url(#rl-ring)" strokeWidth="1.5" />
              </g>
              <g className="spin-slow-rev" style={{ transformOrigin: "150px 150px" }}>
                <polygon points={hexPoints(114)} fill="none" stroke="url(#rl-ring)" strokeOpacity="0.5" strokeWidth="1" strokeDasharray="4 8" />
              </g>
            </svg>
            <div className="float absolute inset-0 flex items-center justify-center">
              <Logo size={150} />
            </div>
          </div>
        </Reveal>

        {/* RIGHT — heading, tracks, button */}
        <div>
          <Reveal>
            <p className="mb-3 text-sm font-semibold tracking-widest uppercase text-brand-violet dark:text-brand-sky">
              Relearn
            </p>
            <Editable
              k="relearn.heading"
              as="h2"
              className="font-display font-bold text-4xl md:text-5xl leading-[1.04] tracking-tight"
            />
          </Reveal>

          <Reveal delay={90}>
            <div className="mt-8 space-y-4">
              {([
                ["relearn.track.1.label", "relearn.track.1.desc"],
                ["relearn.track.2.label", "relearn.track.2.desc"],
                ["relearn.track.3.label", "relearn.track.3.desc"],
              ] as const).map(([labelKey, descKey]) => (
                <div
                  key={labelKey}
                  className="rounded-xl border border-ink/10 dark:border-paper/10 bg-paper/40 dark:bg-ink/40 px-5 py-4"
                >
                  <Editable
                    k={labelKey}
                    as="p"
                    bare
                    className="font-display font-semibold text-sm md:text-base text-ink dark:text-paper"
                  />
                  <Editable
                    k={descKey}
                    as="p"
                    bare
                    className="mt-1 text-xs md:text-sm text-ink/60 dark:text-paper/60 leading-relaxed"
                  />
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="mt-10">
              <Button href="/relearn" variant="primary">Visit Relearn</Button>
            </div>
          </Reveal>
        </div>

      </section>
    </Backdrop>
  );
}
